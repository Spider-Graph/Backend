import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';

import { MemcachedCache } from 'apollo-server-cache-memcached';
import { join } from 'path';

import { UserService } from '../graphql/user/user.service';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(private readonly userService: UserService) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const directiveResolvers = {
      isAuthenticated: (next: () => any, source: any, args: any, { currentUser }) => {
        if (!currentUser) {
          throw new Error('You are not authenticated!');
        }

        return next();
      },
    };

    return {
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: './src/graphql.ts',
        outputAs: 'class',
      },
      path: '/api',
      directiveResolvers,
      context: async ({ req, res, connection }) => {
        if (connection) {
          return { req: connection.context };
        }

        const { token } = req.headers;
        const currentUser = (await this.userService.findOneByToken(token)) || null;
        return { req, res, currentUser };
      },
      debug: true,
      persistedQueries: {
        cache: new MemcachedCache(
          ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
          {
            retries: 10,
            retry: 10000,
          },
        ),
      },
      installSubscriptionHandlers: true,
      introspection: true,
      playground: {
        settings: {
          'editor.cursorShape': 'line',
          'editor.fontFamily': `'Fira Code','Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'editor.fontSize': 14,
          'editor.reuseHeaders': true,
          'editor.theme': 'light',
          'general.betaUpdates': false,
          'queryPlan.hideQueryPlanResponse': false,
          'request.credentials': 'include',
          'tracing.hideTracingResponse': true,
        },
      },
    };
  }
}
