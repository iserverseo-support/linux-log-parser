import {
  assertEquals,
  assertNotEquals,
} from "jsr:@std/assert";

import {
  filterByService,
  findAuthFailures,
  parseLog,
  parseLogLine,
} from "./mod.ts";

Deno.test("Parse a valid log line", () => {
  const line =
    "Sep 17 12:30:45 server sshd[1234]: Failed password for root";

  const result = parseLogLine(line);

  assertNotEquals(result, null);
  assertEquals(result?.hostname, "server");
  assertEquals(result?.service, "sshd");
  assertEquals(result?.pid, 1234);
});

Deno.test("Return null for invalid log line", () => {
  const result = parseLogLine("Invalid log format");

  assertEquals(result, null);
});

Deno.test("Parse multiple log lines", () => {
  const logs = `
Sep 17 12:30:45 server sshd[1234]: Failed password for root
Sep 17 12:31:00 server nginx: Request completed
`;

  const result = parseLog(logs);

  assertEquals(result.length, 2);
});

Deno.test("Filter logs by service", () => {
  const logs = `
Sep 17 12:30:45 server sshd[1234]: Failed password for root
Sep 17 12:31:00 server nginx: Request completed
`;

  const entries = parseLog(logs);
  const result = filterByService(entries, "sshd");

  assertEquals(result.length, 1);
});

Deno.test("Find authentication failures", () => {
  const logs = `
Sep 17 12:30:45 server sshd[1234]: Failed password for root
Sep 17 12:31:00 server sshd[5678]: Accepted password for user
`;

  const entries = parseLog(logs);
  const result = findAuthFailures(entries);

  assertEquals(result.length, 1);
});
