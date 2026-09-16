export interface LogEntry {
  timestamp?: string;
  hostname?: string;
  service?: string;
  pid?: number;
  message: string;
  raw: string;
}

export interface LogSummary {
  total: number;
  byService: Record<string, number>;
  errors: number;
  warnings: number;
}
