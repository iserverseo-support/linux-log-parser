import { parseFile, summarize } from "./mod.ts";

const entries = await parseFile("/var/log/messages");

console.log("Parsed entries:");
console.log(JSON.stringify(entries, null, 2));

console.log("\nSummary:");
console.log(JSON.stringify(summarize(entries), null, 2));
