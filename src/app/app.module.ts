import { Module, CacheModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from './config/cache.service';
import { GraphqlService } from './config/graphql.service';
import { TypeormService } from './config/typeorm.service';

import { GQLModule } from './graphql/gql.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    GraphQLModule.forRootAsync({
      useClass: GraphqlService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    GQLModule,
  ],
})
export class AppModule {}
