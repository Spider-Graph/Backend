import { Module, Global } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Chart, Dataset } from './chart.entity';
import { ChartService } from './chart.service';
import { ChartResolver } from './chart.resolver';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Chart, Dataset])],
  providers: [ChartService, ChartResolver],
  exports: [ChartService],
})
export class ChartModule {}
