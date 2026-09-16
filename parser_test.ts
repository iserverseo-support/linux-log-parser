import { assertEquals } from "@std/assert";
import { parse, parseLine, summarize } from "./mod.ts";

Deno.test("parses a standard syslog line", () => {
  const entry = parseLine(
    "Sep 16 12:30:10 server01 sshd[1234]: Accepted publickey for root",
  );

  assertEquals(entry?.timestamp, "Sep 16 12:30:10");
  assertEquals(entry?.hostname, "server01");
  assertEquals(entry?.service, "sshd");
  assertEquals(entry?.pid, 1234);
  assertEquals(
    entry?.message,
    "Accepted publickey for root",
  );
});

Deno.test("parses multiple lines", () => {
  const entries = parse(`
Sep 16 12:30:10 server01 nginx: request completed
Sep 16 12:30:11 server01 sshd[1234]: Failed password
`);

  assertEquals(entries.length, 2);
});

Deno.test("creates a log summary", () => {
  const entries = parse(`
Sep 16 12:30:10 server01 nginx: request completed
Sep 16 12:30:11 server01 sshd[1234]: Failed password
Sep 16 12:30:12 server01 nginx: warning connection
`);

  const summary = summarize(entries);

  assertEquals(summary.total, 3);
  assertEquals(summary.errors, 1);
  assertEquals(summary.warnings, 1);
});
