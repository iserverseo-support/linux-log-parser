export interface LogEntry {
  raw: string;
  timestamp: string;
  hostname: string;
  service: string;
  pid?: number;
  message: string;
}

export function parseLogLine(line: string): LogEntry | null {
  const pattern =
    /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+([^\s:[\]]+)(?:\[(\d+)\])?:\s?(.*)$/;

  const match = line.trim().match(pattern);

  if (!match) {
    return null;
  }

  const [, timestamp, hostname, service, pid, message] = match;

  return {
    raw: line,
    timestamp,
    hostname,
    service,
    pid: pid ? Number(pid) : undefined,
    message,
  };
}

export function parseLog(content: string): LogEntry[] {
  return content
    .split(/\r?\n/)
    .map(parseLogLine)
    .filter((entry): entry is LogEntry => entry !== null);
}

export function filterByService(
  entries: LogEntry[],
  service: string,
): LogEntry[] {
  return entries.filter((entry) => entry.service === service);
}

export function findAuthFailures(entries: LogEntry[]): LogEntry[] {
  const pattern = /failed password|authentication failure|invalid user/i;

  return entries.filter((entry) => pattern.test(entry.message));
}
