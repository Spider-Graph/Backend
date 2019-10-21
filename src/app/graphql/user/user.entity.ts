import * as bcrypt from 'bcrypt';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as uuid from 'uuid';

import { UserDTO } from '../../../interfaces';
import { Chart } from '../chart/chart.entity';

@Entity()
export class User extends UserDTO {
  @PrimaryColumn()
  // tslint:disable-next-line: variable-name
  id: string;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @OneToMany(type => Chart, chart => chart.user)
  charts: Chart[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  @BeforeInsert()
  async beforeInsert() {
    this.id = uuid.v1();
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async matchesPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
