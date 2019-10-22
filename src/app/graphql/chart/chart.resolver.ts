import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  ChangeChartDTO,
  ChangeDatasetDTO,
  ChartChangeResponseDTO,
  DatasetChangeResponseDTO,
} from '../../../interfaces';
import { User } from '../user/user.entity';
import { Chart, Dataset } from './chart.entity';
import { ChartService } from './chart.service';

@Resolver('CDB')
export class ChartResolver {
  public constructor(private readonly chartService: ChartService) {}

  @Query(() => Chart)
  public async chart(@Context('currentUser') user: User, @Args('id') id: string) {
    return await this.chartService.getChart(user, id);
  }

  @Query(() => [Chart])
  public async charts(@Context('currentUser') user: User) {
    return await this.chartService.getCharts(user);
  }

  @Mutation(() => ChartChangeResponseDTO)
  public async addChart(@Context('currentUser') user: User, @Args('chart') chart: ChangeChartDTO) {
    return this.chartService.addChart(user, chart);
  }

  @Mutation(() => ChartChangeResponseDTO)
  public async updateChart(
    @Context('currentUser') user: User,
    @Args('id') id: string,
    @Args('chart') chart: ChangeChartDTO,
  ) {
    return this.chartService.updateChart(user, id, chart);
  }

  @Mutation(() => Boolean)
  public async deleteChart(@Context('currentUser') user: User, @Args('id') id: string) {
    return this.chartService.deleteChart(user, id);
  }

  @Query(() => Dataset)
  public async dataset(
    @Context('currentUser') user: User,
    @Args('chart') chart: string,
    @Args('label') label: string,
  ) {
    return this.chartService.getDataset(user, chart, label);
  }

  @Query(() => [Dataset])
  public async datasets(@Context('currentUser') user: User, @Args('chart') chart: string) {
    return this.chartService.getDatasets(user, chart);
  }

  @Mutation(() => DatasetChangeResponseDTO)
  public async addDataset(
    @Context('currentUser') user: User,
    @Args('chart') chart: string,
    @Args('dataset') dataset: ChangeDatasetDTO,
  ) {
    return this.chartService.addDataset(user, chart, dataset);
  }

  @Mutation(() => DatasetChangeResponseDTO)
  public async updateDataset(
    @Context('currentUser') user: User,
    @Args('chart') chart: string,
    @Args('label') label: string,
    @Args('dataset') dataset: ChangeDatasetDTO,
  ) {
    return this.chartService.updateDataset(user, chart, label, dataset);
  }

  @Mutation(() => DatasetChangeResponseDTO)
  public async deleteDataset(
    @Context('currentUser') user: User,
    @Args('chart') chart: string,
    @Args('label') label: string,
  ) {
    return this.chartService.deleteDataset(user, chart, label);
  }
}
