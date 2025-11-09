export type LogRange = {
  type: 'quick' | 'absolute';
  quickRange: string;
  absoluteFrom: string;
  absoluteTo: string;
};

export type LogFilters = {
  range: LogRange;
  refModule: string;
  commandName: string;
};

export type LogEntry = {
  refModule?: string;
  timestamp: string;
  moduleState?: string;
  commandName?: string;
  commandState?: string;
  connectionState?: string;
  errors?: string;
};
