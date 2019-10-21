import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { ValidationPipe } from './validation.pipe';

import * as dotenv from 'dotenv';
import * as express from 'express';
import { Express } from 'express';

import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';

dotenv.config();
const port = process.env.PORT || 3333;
const server = express();

const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  app.use(compression());
  app.use(helmet());
  // app.use(
  //   new rateLimit({
  //     windowMs: 15 * 60 * 1000,
  //     max: 100,
  //     message: 'Too many request created from this IP, please try again after an hour',
  //   })
  // );

  app.useGlobalPipes(new ValidationPipe());

  return app.init();
};

createNestServer(server).then(app => {
  app.listen(port, '0.0.0.0').then(() => {
    console.log('Listening at http://localhost:' + port);
  });
});
