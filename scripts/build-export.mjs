import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const apiDir = path.join(rootDir, "src", "app", "api");
const backupApiDir = path.join(rootDir, "src", "_api_temp_backup");
const outDir = path.join(rootDir, "out");

let moved = false;

try {
  if (fs.existsSync(apiDir)) {
    console.log("Temporarily moving src/app/api to backup for static HTML export...");
    fs.renameSync(apiDir, backupApiDir);
    moved = true;
  }

  console.log("Executing next build with EXPORT=true...");
  const env = {
    ...process.env,
    EXPORT: "true",
  };

  execSync("npx next build", {
    cwd: rootDir,
    stdio: "inherit",
    env,
  });

  // Post-processing for GitHub Pages
  if (fs.existsSync(outDir)) {
    // 1. Add .nojekyll so GitHub Pages doesn't ignore _next
    fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
    console.log("Created out/.nojekyll");

    // 2. Ensure 404.html exists for SPA fallback routing
    const indexHtml = path.join(outDir, "index.html");
    const fourOhFour = path.join(outDir, "404.html");
    if (fs.existsSync(indexHtml) && !fs.existsSync(fourOhFour)) {
      fs.copyFileSync(indexHtml, fourOhFour);
      console.log("Created out/404.html fallback from index.html");
    }
  }

  console.log("Static GitHub Pages build completed successfully!");
} catch (error) {
  console.error("Build failed:", error);
  process.exitCode = 1;
} finally {
  if (moved && fs.existsSync(backupApiDir)) {
    console.log("Restoring src/app/api from backup...");
    fs.renameSync(backupApiDir, apiDir);
    console.log("Restored src/app/api successfully.");
  }
}
