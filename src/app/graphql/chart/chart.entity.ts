// tslint:disable: max-classes-per-file
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import uuid = require('uuid');

import { ChartDTO, DatasetDTO } from '../../../interfaces';
import { User } from '../user/user.entity';

@Entity()
export class Chart extends ChartDTO {
  public constructor(data?: { title: string; labels: string[]; user: User }) {
    super();
    if (data) {
      this.title = data.title;
      this.labels = data.labels;
      this.user = data.user;
    }
  }

  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column('simple-array')
  labels: string[];

  @OneToMany(type => Dataset, dataset => dataset.chart)
  datasets: Dataset[];

  @ManyToOne(type => User, user => user.charts)
  user: User;

  @BeforeInsert()
  public async beforeInsert() {
    this.id = uuid.v1();
  }
}

@Entity()
export class Dataset extends DatasetDTO {
  public constructor(data?: { label: string; values: number[]; chart: Chart }) {
    super();
    if (data) {
      this.label = data.label;
      this.values = data.values;
      this.chart = data.chart;
    }
  }

  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @Column('simple-array')
  values: number[];

  @ManyToOne(type => Chart, chart => chart.datasets)
  chart: Chart;

  @BeforeInsert()
  public async beforeInsert() {
    this.id = uuid.v1();
  }
}
