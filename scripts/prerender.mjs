import { readdir, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handleRequest = createRequestHandler(build, "production");
const base = build.basename === "/" ? "" : build.basename;
const articlePaths = (await readdir("app/content/articles"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => `/articles/${file.replace(/\.md$/, "")}`);
const paths = ["/", "/articles", "/projects", "/about", ...articlePaths];

for (const pathname of paths) {
  const response = await handleRequest(
    new Request(`https://pages.example${base}${pathname}`),
  );

  if (!response.ok) {
    throw new Error(`Failed to prerender ${pathname}: ${response.status}`);
  }

  const outputPath = pathname === "/"
    ? "build/client/index.html"
    : join("build/client", pathname, "index.html");

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, await response.text());
  console.log(`Prerendered ${pathname}`);
}
