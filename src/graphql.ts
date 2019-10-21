
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class ChangeChart {
    title: string;
    labels?: string[];
}

export class ChangeDataset {
    label: string;
    values?: number[];
}

export class Credentials {
    username: string;
    password: string;
}

export class UserDetails {
    username: string;
    password: string;
    email: string;
}

export class Chart {
    id: string;
    title: string;
    labels?: string[];
    datasets?: Dataset[];
}

export class ChartChangeResponse {
    chart: Chart;
    charts?: Chart[];
    completed: boolean;
}

export class Dataset {
    id: string;
    label: string;
    values?: number[];
}

export class DatasetChangeResponse {
    dataset: Dataset;
    datasets?: Dataset[];
    completed: boolean;
}

export class LoginResponse {
    token: string;
}

export abstract class IMutation {
    abstract addChart(chart: ChangeChart): ChartChangeResponse | Promise<ChartChangeResponse>;

    abstract updateChart(id: string, chart: ChangeChart): ChartChangeResponse | Promise<ChartChangeResponse>;

    abstract deleteChart(id: string): ChartChangeResponse | Promise<ChartChangeResponse>;

    abstract addDataset(chart: string, dataset: ChangeDataset): DatasetChangeResponse | Promise<DatasetChangeResponse>;

    abstract updateDataset(chart: string, id: string, dataset: ChangeDataset): DatasetChangeResponse | Promise<DatasetChangeResponse>;

    abstract deleteDataset(chart: string, id: string): DatasetChangeResponse | Promise<DatasetChangeResponse>;

    abstract login(credentials: Credentials): LoginResponse | Promise<LoginResponse>;

    abstract register(details: UserDetails): LoginResponse | Promise<LoginResponse>;

    abstract updateUser(details: UserDetails): boolean | Promise<boolean>;

    abstract deleteUser(): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract chart(id: string): Chart | Promise<Chart>;

    abstract charts(): Chart[] | Promise<Chart[]>;

    abstract dataset(chart: string, id: string): Dataset | Promise<Dataset>;

    abstract datasets(chart: string): Dataset[] | Promise<Dataset[]>;

    abstract me(): User | Promise<User>;
}

export class User {
    username: string;
    email: string;
}
