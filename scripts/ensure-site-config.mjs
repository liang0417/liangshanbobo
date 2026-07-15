import { constants } from "node:fs";
import { access, copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeConfig, validateConfig } from "./site-config.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const examplePath = join(projectRoot, "app/data/site.config.example.json");
const activeConfigPath = join(projectRoot, "app/data/site.config.json");

try {
  await access(activeConfigPath, constants.F_OK);
} catch (error) {
  if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
  await copyFile(examplePath, activeConfigPath);
  console.log("已从示例创建本地配置：app/data/site.config.json");
}

const current = JSON.parse(await readFile(activeConfigPath, "utf8"));
const normalized = normalizeConfig(current);
validateConfig(normalized);
const serialized = `${JSON.stringify(normalized, null, 2)}\n`;
if (serialized !== `${JSON.stringify(current, null, 2)}\n`) {
  await writeFile(activeConfigPath, serialized, "utf8");
  console.log("已补齐本地配置的最新字段。");
}
