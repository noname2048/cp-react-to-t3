type Sensor = {
  uuid: string;
  name?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

type SensorRecord = {
  id: number;
  uuid: string;
  temperature: number;
  humidity: number;
  created_at: string;
};

type SensorRecordList = SensorRecord[];
