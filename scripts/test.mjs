// Runs the compiled tests in dist/. `node --test` alone also picks up src/**/*.test.ts on newer
// Node versions, where the `.js` import specifiers cannot be resolved without a build step.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

function collect(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return collect(path);
    }
    return entry.name.endsWith(".test.js") ? [path] : [];
  });
}

const files = collect("dist");
if (files.length === 0) {
  console.error("No compiled tests found in dist/. Run `npm run build` first.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
