import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { getMetadataArgsStorage } from 'typeorm';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      ssl: true,
    };
  }
}
