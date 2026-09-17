# Linux Log Parser

A lightweight Deno module for parsing Linux syslog-style log files.

## Features

- Parse Linux syslog log lines
- Extract timestamps, hostnames, services, and process IDs
- Filter logs by service
- Detect common authentication failures
- Written in TypeScript
- Compatible with Deno

## Installation

Import the module directly:

```typescript
import {
  parseLog,
  filterByService,
  findAuthFailures,
} from "./mod.ts";
