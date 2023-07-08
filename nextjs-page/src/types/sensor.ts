export type SensorData = {
  id: number;
  temperature: number;
  humidity: number;
  created_at: string;
};

export type SensorDataDisplay = SensorData & {
  ca: string;
};

export type SensorDataResponse = {
  data: SensorData[];
  count: number;
};

export type SensorDataFetch = {
  data: SensorDataDisplay[];
  count: number;
};
