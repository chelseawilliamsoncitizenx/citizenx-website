import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../apps/web/out/", import.meta.url));
const destination = fileURLToPath(new URL("../out/", import.meta.url));

if (!existsSync(source)) {
  throw new Error("The web build did not create apps/web/out.");
}

rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });
console.log(`Prepared Site output at ${destination}`);
