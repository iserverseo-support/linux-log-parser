import type { LogEntry, LogSummary } from "./types.ts";

const SYSLOG_PATTERN =
  /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+([^:]+):\s?(.*)$/;

const SERVICE_PID_PATTERN = /^([^\[]+?)(?:\[(\d+)\])?$/;

export function parseLine(line: string): LogEntry | null {
  const raw = line.trim();

  if (!raw) {
    return null;
  }

  const match = raw.match(SYSLOG_PATTERN);

  if (!match) {
    return {
      message: raw,
      raw,
    };
  }

  const [, timestamp, hostname, process, message] = match;

  const processMatch = process.trim().match(SERVICE_PID_PATTERN);

  const service = processMatch?.[1]?.trim();
  const pid = processMatch?.[2]
    ? Number.parseInt(processMatch[2], 10)
    : undefined;

  return {
    timestamp,
    hostname,
    service,
    pid,
    message,
    raw,
  };
}

export function parse(text: string): LogEntry[] {
  return text
    .split(/\r?\n/)
    .map(parseLine)
    .filter((entry): entry is LogEntry => entry !== null);
}

export function summarize(entries: LogEntry[]): LogSummary {
  const byService: Record<string, number> = {};
  let errors = 0;
  let warnings = 0;

  for (const entry of entries) {
    if (entry.service) {
      byService[entry.service] = (byService[entry.service] ?? 0) + 1;
    }

    const message = entry.message.toLowerCase();

    if (/\berror\b|\bfailed\b|\bfailure\b/.test(message)) {
      errors++;
    }

    if (/\bwarning\b|\bwarn\b/.test(message)) {
      warnings++;
    }
  }

  return {
    total: entries.length,
    byService,
    errors,
    warnings,
  };
}

export async function parseFile(path: string): Promise<LogEntry[]> {
  const text = await Deno.readTextFile(path);
  return parse(text);
}
