// src/types/index.ts

export interface ModuleEntity {
  refModule: string | null;
  nameModule: string | null;
  description: string | null;
  refFactory: string | null;
}

export interface ModuleStateLog {
  refModule?: string | null;
  timestamp: string;
  moduleState?: string | null;
  commandName?: string | null;
  commandState?: string | null;
  connectionState?: string | null;
}

export interface Sensor {
  sensorId?: string | null;
  name?: string | null;
  sensorType?: string | null;
  description?: string | null;
  unit?: string | null;
}

export interface SensorLog {
  sensorId?: string | null;
  timestamp: string;
  valueRaw?: string | null;
  valueNumeric?: number | null;
}
