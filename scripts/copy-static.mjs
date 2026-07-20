import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = join(root, "..", "public");
const distDir = join(root, "..", "dist");

cpSync(publicDir, distDir, { recursive: true });
