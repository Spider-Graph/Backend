import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChangeChartDTO, ChangeDatasetDTO } from '../../../interfaces';
import { User } from '../user/user.entity';
import { Chart, Dataset } from './chart.entity';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(Chart)
    private readonly chartRepository: Repository<Chart>,
    @InjectRepository(Dataset)
    private readonly datasetRepository: Repository<Dataset>,
  ) {}

  public async getChart(user: User, id: string) {
    const chart = await this.chartRepository.findOne({ user, id }, { relations: ['datasets'] });
    if (!chart) {
      throw new Error('Chart not found!');
    }

    return chart;
  }

  public async getCharts(user: User) {
    return await this.chartRepository.find({
      relations: ['datasets'],
      where: {
        user,
      },
    });
  }

  public async addChart(user: User, newChart: ChangeChartDTO) {
    this.validateChart(newChart);
    const chart = new Chart({ user, ...newChart });
    const completed = !!(await this.chartRepository.save(chart));
    const charts = await this.getCharts(user);
    return { chart, charts, completed };
  }

  public async updateChart(user: User, id: string, update: ChangeChartDTO) {
    this.validateChart(update);
    const currentChart = await this.getChart(user, id);
    const chart = { ...currentChart, ...update };
    chart.datasets = this.updateChartDatasets(chart);
    const completed = !!(await this.chartRepository.save(chart));
    const charts = await this.getCharts(user);
    return { chart, charts, completed };
  }

  public async deleteChart(user: User, id: string) {
    const chart = await this.getChart(user, id);
    chart.datasets.forEach(dataset => this.deleteDataset(user, id, dataset.id));
    const completed = !!(await this.chartRepository.delete({ user, id }));
    const charts = await this.getCharts(user);
    return { chart, charts, completed };
  }

  public async getDataset(user: User, chartID: string, id: string) {
    const chart = await this.getChart(user, chartID);
    const dataset = await this.datasetRepository.findOne({ chart, id }, { relations: ['chart'] });
    if (!dataset) {
      throw new Error('Dataset not found!');
    }

    return dataset;
  }

  public async getDatasets(user: User, chartID: string) {
    const chart = await this.getChart(user, chartID);
    return await this.datasetRepository.find({
      relations: ['chart'],
      where: {
        chart,
      },
    });
  }

  public async addDataset(user: User, chartID: string, newDataset: ChangeDatasetDTO) {
    const chart = await this.getChart(user, chartID);
    const { label } = newDataset;

    if (await this.datasetRepository.findOne({ chart, label }, { relations: ['chart'] })) {
      throw new Error('Existing dataset with that Label');
    }

    const data = this.updateDataLength(newDataset.data, chart.labels.length);
    const dataset = new Dataset({ chart, ...newDataset, data });
    const completed = !!(await this.datasetRepository.save(dataset));
    const datasets = await this.getDatasets(user, chartID);
    return { dataset, datasets, completed };
  }

  public async updateDataset(user: User, chartID: string, id: string, update: ChangeDatasetDTO) {
    const chart = await this.getChart(user, chartID);
    const data = this.updateDataLength(update.data, chart.labels.length);
    const currentDataset = await this.getDataset(user, chartID, id);
    const dataset = { ...currentDataset, ...update, data };
    const completed = !!(await this.datasetRepository.save(dataset));
    const datasets = await this.getDatasets(user, chartID);
    return { dataset, datasets, completed };
  }

  public async deleteDataset(user: User, chartID: string, id: string) {
    const dataset = await this.getDataset(user, chartID, id);
    const completed = !!(await this.datasetRepository.delete({ id }));
    const datasets = await this.getDatasets(user, chartID);
    return { dataset, datasets, completed };
  }

  private validateChart(chart: ChangeChartDTO) {
    const checkDuplicates = (arr: any[]) => arr.every((item, index) => arr.indexOf(item) !== index);

    if (chart.labels.length > 3) {
      throw new Error('At least three labels are required!');
    }

    if (checkDuplicates(chart.labels)) {
      throw new Error('Labels must include no duplicates!');
    }
  }

  private updateChartDatasets(chart: Chart) {
    return chart.datasets.map(dataset => {
      dataset.data = this.updateDataLength(dataset.data, chart.labels.length);
      this.datasetRepository.save(dataset);
      return dataset;
    });
  }

  private updateDataLength(data: number[], chartLength: number) {
    const update = [...data];
    update.length = chartLength;
    update.fill(0, data.length, chartLength);
    return update;
  }
}
