import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CredentialsDTO, LoginResponseDTO, UserDetailsDTO, UserDTO } from '../../../interfaces';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @Query(() => UserDTO)
  public async me(@Context('currentUser') user: User) {
    return user;
  }

  @Mutation(() => LoginResponseDTO)
  public async register(@Args('details') details: UserDetailsDTO) {
    return this.userService.create(details);
  }

  @Mutation(() => Boolean)
  public async updateUser(
    @Context('currentUser') user: User,
    @Args('details') details: UserDetailsDTO,
  ) {
    return this.userService.update(user, details);
  }

  @Mutation(() => Boolean)
  public async deleteUser(@Context('currentUser') user: User) {
    return this.userService.delete(user);
  }

  @Mutation(() => LoginResponseDTO)
  public async login(@Args('credentials') credentials: CredentialsDTO) {
    return this.userService.login(credentials);
  }
}
