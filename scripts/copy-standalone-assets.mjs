import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const standaloneDir = join(root, ".next", "standalone");

function copyDir(source, destination) {
  if (!existsSync(source)) {
    console.warn(`Skipping missing asset directory: ${source}`);
    return;
  }

  rmSync(destination, { recursive: true, force: true });
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
  console.log(`Copied ${source} -> ${destination}`);
}

if (!existsSync(standaloneDir)) {
  console.warn("Skipping standalone assets: .next/standalone was not created.");
  process.exit(0);
}

copyDir(join(root, ".next", "static"), join(standaloneDir, ".next", "static"));
copyDir(join(root, "public"), join(standaloneDir, "public"));
