#!/usr/bin/env node
// Comprueba que el lint detecta lo que debe (fixtures malos) y deja pasar lo correcto (fixtures buenos).
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const run = (f) => spawnSync(process.execPath, [join(dir, "lint.mjs"), join(dir, "fixtures", f)], { encoding: "utf8" });
const fail = (m) => { console.error(`✗ lint.test: ${m}`); process.exit(1); };

const bad = run("lint-bad.css");
if (bad.status !== 1) fail(`lint-bad.css debería fallar (código ${bad.status})`);
const expected = [
  ["1", "color"], ["2", "color"], ["3", "color"], ["4", "spacing"], ["5", "spacing"],
  ["6", "spacing"], ["7", "radius"], ["8", "token"], ["9", "lint-allow sin motivo"],
];
for (const [line, what] of expected) {
  const re = new RegExp(`lint-bad\\.css:${line}\\b.*${what}|lint-bad\\.css:${line} — ${what}`);
  if (!re.test(bad.stderr)) fail(`no se detectó «${what}» en la línea ${line}\n${bad.stderr}`);
}
const good = run("lint-good.css");
if (good.status !== 0) fail(`lint-good.css debería pasar\n${good.stderr}`);
console.log(`✓ lint.test: ${expected.length} infracciones detectadas, fixture correcto limpio`);
