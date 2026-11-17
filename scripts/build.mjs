#!/usr/bin/env node
// Genera dist/tokens.css (variables CSS + clases tipográficas) desde los .tokens.json DTCG.
// Sin dependencias. Si el sistema crece, se puede sustituir por Style Dictionary v4 (soporta DTCG).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(root, "tokens", `${f}.tokens.json`), "utf8"));
const core = read("core"), prim = read("primitives"), light = read("theme-light"), dark = read("theme-dark");

const num = (n) => String(+n.toFixed(4));
const dim = (d) => `${num(d.value)}${d.unit}`;
const color = (c) => {
  const [r, g, b] = c.components.map((x) => Math.round(x * 255));
  const a = c.alpha ?? 1;
  if (a === 1) return c.hex ?? "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `rgba(${r},${g},${b},${a})`;
};
const family = (f) => f.map((s) => (/\s/.test(s) || s === "Archivo" ? `"${s}"` : s)).join(", ");
const entries = (group) => Object.entries(group).filter(([k]) => !k.startsWith("$"));
const comment = (t) => (t.$description ? ` /* ${t.$description} */` : "");

// Recorre grupos anidados y devuelve los tokens hoja con su ruta.
const leaves = (node, path = []) =>
  entries(node).flatMap(([k, v]) => ("$value" in v ? [{ path: [...path, k], token: v }] : leaves(v, [...path, k])));
const isRef = (v) => typeof v === "string" && /^\{[^{}]+\}$/.test(v);
const varName = (path) => path.join("-");
const semantic = (doc) => leaves(doc.color).map(({ path, token }) => ({ path, token, name: `color-${varName(path)}` }));
// Un semántico apunta a un primitivo ({palette.neutral.93} → var(--palette-neutral-93)) o lleva valor directo (translúcidos).
const semValue = (t) => (isRef(t.$value) ? `var(--${varName(t.$value.slice(1, -1).split("."))})` : color(t.$value));
const semLight = semantic(light), semDark = semantic(dark);
const legacy = semLight.filter((e) => e.token.$extensions?.["com.ekoa"]?.legacyName);
const legacyName = (e) => e.token.$extensions["com.ekoa"].legacyName;

const lines = [];
const out = (s = "") => lines.push(s);

out("/* EKOA — generado por scripts/build.mjs desde tokens/*.tokens.json. No editar a mano. */");
out("/* Primitivos: paletas por familia (el número es el tono, luminosidad OKLCH 0–100). Los temas no los usan directamente. */");
out(":root {");
for (const { path, token } of leaves(prim.palette)) out(`  --palette-${varName(path)}: ${color(token.$value)};${token.$extensions?.["com.ekoa"]?.generated ? " /* generado, sin uso */" : ""}`);
out("}");
out("/* Semánticos: lo que usan los componentes. Cada tema apunta a un primitivo distinto. */");
out(':root, [data-theme="light"] {');
for (const e of semLight) out(`  --${e.name}: ${semValue(e.token)};${comment(e.token)}`);
out("  /* Alias heredados (nombres anteriores): se mantienen para no romper componentes ni código existente. */");
for (const e of legacy) out(`  --${legacyName(e)}: var(--${e.name});`);
for (const [k, t] of entries(core.shadow)) {
  const s = t.$value;
  out(`  --shadow-${k}: ${dim(s.offsetX).replace(/^0px$/, "0")} ${dim(s.offsetY).replace(/^0px$/, "0")} ${dim(s.blur)} ${color(s.color)};${comment(t)}`);
}
out("}");
out('[data-theme="dark"] {');
for (const e of semDark) out(`  --${e.name}: ${semValue(e.token)};`);
for (const e of legacy) out(`  --${legacyName(e)}: var(--${e.name});`);
out("}");

out(":root {");
for (const [k, t] of entries(core.space)) out(`  --space-${k}: ${dim(t.$value)};${comment(t)}`);
for (const [k, t] of entries(core.radius)) out(`  --radius-${k}: ${dim(t.$value)};${comment(t)}`);
for (const [k, t] of entries(core.layout)) out(`  --${k}: ${dim(t.$value)};${comment(t)}`);
for (const [k, t] of entries(core.font.family)) out(`  --font-${k}: ${family(t.$value)};`);
for (const [k, t] of entries(core.text)) {
  const v = t.$value, fam = v.fontFamily.slice(1, -1).split(".").pop();
  const lh = Math.round(v.fontSize.value * v.lineHeight);
  out(`  --text-${k}: ${v.fontWeight} ${dim(v.fontSize)}/${lh}px var(--font-${fam});${comment(t)}`);
}
out("}");

for (const [k, t] of entries(core.text)) {
  const v = t.$value, fam = v.fontFamily.slice(1, -1).split(".").pop();
  const ext = t.$extensions?.["com.ekoa"] ?? {};
  out(`.${k} {`);
  out(`  font-family: var(--font-${fam});`);
  out(`  font-size: ${dim(v.fontSize)};`);
  out(`  line-height: ${Math.round(v.fontSize.value * v.lineHeight)}px;`);
  out(`  font-weight: ${v.fontWeight};`);
  out(`  letter-spacing: ${ext.letterSpacingEm ? ext.letterSpacingEm + "em" : "0"};`);
  if (ext.textTransform) out(`  text-transform: ${ext.textTransform};`);
  out("}");
}

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "tokens.css"), lines.join("\n") + "\n");
console.log(`✓ dist/tokens.css (${lines.length} líneas)`);
