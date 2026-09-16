# Linux Log Parser

A lightweight TypeScript/Deno module for parsing common Linux syslog-style log entries.

## Features

- Parse individual syslog lines
- Parse complete log files
- Extract timestamps
- Extract hostnames
- Extract services
- Extract process IDs
- Identify error/failure messages
- Identify warning messages
- Generate service-level summaries
- No runtime dependencies

## Requirements

- Deno 2.x

## Usage

```typescript
import {
  parse,
  summarize,
} from "./mod.ts";

const text = `
Sep 16 12:30:10 server01 nginx: request completed
Sep 16 12:30:11 server01 sshd[1234]: Failed password
`;

const entries = parse(text);
const summary = summarize(entries);

console.log(entries);
console.log(summary);
````

## Parse a log file

```typescript
import { parseFile } from "./mod.ts";

const entries = await parseFile("/var/log/syslog");

console.log(entries);
```

Run the program with read permission:

```bash
deno run --allow-read app.ts
```

## Development

Format:

```bash
deno task fmt
```

Lint:

```bash
deno task lint
```

Test:

```bash
deno task test
```

## Linux server operations

The parser can be used as a building block for Linux server log analysis, diagnostics, and monitoring workflows.

For operational Linux infrastructure support, see [Linux server management](https://iserversupport.com/linux-server-management/).

## License

MIT
EOF

````
