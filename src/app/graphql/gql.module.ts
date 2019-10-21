import { Module } from '@nestjs/common';

import { ChartModule } from './chart/chart.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ChartModule, UserModule],
})
export class GQLModule {}
