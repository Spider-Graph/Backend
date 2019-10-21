import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationError } from 'apollo-server-core';
import * as jwt from 'jsonwebtoken';
import { MongoRepository } from 'typeorm';

import { CredentialsDTO, LoginResponseDTO, UserDetailsDTO, UserDTO } from '../../../interfaces';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async findById(id: string): Promise<UserDTO> {
    return await this.userRepository.findOne({ id });
  }

  async create(details: UserDetailsDTO): Promise<LoginResponseDTO> {
    const { username, password, email } = details;

    const existedUser = await this.userRepository.findOne({ email });
    if (existedUser) {
      throw new Error('Email has already been taken.');
    }

    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    await this.userRepository.save(user);

    return this.login({ username, password });
  }

  async update(user: User, details: UserDetailsDTO): Promise<boolean> {
    const { username, password, email } = details;
    const update = {
      ...user,
      username,
      password,
      email,
    };

    return !!(await this.userRepository.save(update));
  }

  async delete(user: User): Promise<boolean> {
    return !!(await this.userRepository.delete(user));
  }

  async login(credentials: CredentialsDTO): Promise<LoginResponseDTO> {
    const { username, password } = credentials;

    const user = await this.userRepository.findOne({ username });
    if (!user || !(await user.matchesPassword(password))) {
      throw new AuthenticationError('Incorrect email or password. Please try again.');
    }

    const token = jwt.sign(
      {
        issuer: process.env.HOST,
        subject: user.id,
        audience: user.username,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '30d',
      },
    );

    return { token };
  }

  async findOneByToken(token: string) {
    try {
      const decodeToken = jwt.verify(token, process.env.SECRET_KEY) as Token;
      return await this.userRepository.findOne({
        id: decodeToken.subject,
      });
    } catch (error) {
      return null;
    }
  }
}

interface Token {
  issuer: string;
  subject: string;
  audience: string;
}
