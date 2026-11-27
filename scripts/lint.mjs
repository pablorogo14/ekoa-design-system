#!/usr/bin/env node
// Lint del design system: el código que CONSUME tokens no puede saltárselos.
//
// Revisa components/bundle.css y components/bundle.js (o los archivos que se pasen por argumento).
// Reglas, todas con error (el build falla):
//   color     colores literales (#hex, rgb(), hsl()… o nombres como white/red) → usa un token de color
//   spacing   px literales en padding / margin / gap → usa var(--space-N)
//   radius    px literales en border-radius → usa var(--radius-*)
//   token     var(--x) que no existe en dist/tokens.css (ni se declara en el mismo archivo)
//
// Fuera de alcance a propósito: tokens/ y dist/ (ahí viven los valores), site/ y previews/
// (chrome de la documentación, con su propia paleta).
//
// Excepciones: un comentario `/* lint-allow: motivo */` en la misma línea o en la línea de
// encima (sola en su línea). El motivo es obligatorio y todas las excepciones se listan al final.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const files = args.length ? args : ["components/bundle.css", "components/bundle.js"];

const tokensPath = join(root, "dist", "tokens.css");
if (!existsSync(tokensPath)) {
  console.error("✗ lint: falta dist/tokens.css — ejecuta `npm run build` antes.");
  process.exit(1);
}
const tokensCss = readFileSync(tokensPath, "utf8");
const defined = new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
const byPx = (prefix) => {
  const m = new Map();
  for (const [, name, px] of tokensCss.matchAll(new RegExp(`(--${prefix}-[a-z0-9-]+)\\s*:\\s*(-?[\\d.]+)px`, "gi"))) m.set(Number(px), name);
  return m;
};
const spaceByPx = byPx("space");
const radiusByPx = byPx("radius");

const NAMED = /\b(white|black|red|green|blue|gray|grey|orange|yellow|purple|pink|brown)\b/i;
const FUNC = /\b(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i;
const HEX = /#[0-9a-f]{3,8}\b/i;
const PX = /(-?\d*\.?\d+)px\b/g;
const SPACING = /(?:^|[;{\s])((?:padding|margin)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|gap|row-gap|column-gap)\s*:\s*([^;}]+)/gi;
const RADIUS = /(?:^|[;{\s])(border(?:-(?:top|bottom|start|end)-(?:left|right|start|end))?-radius)\s*:\s*([^;}]+)/gi;
const COLOR_PROPS = /(?:^|[;{\s])(color|background(?:-color)?|border(?:-[a-z]+)?(?:-color)?|outline(?:-color)?|fill|stroke|box-shadow|text-shadow)\s*:\s*([^;}]+)/gi;

const errors = [];
const allowed = [];

for (const file of files) {
  const abs = file.startsWith("/") ? file : join(root, file);
  const rel = relative(root, abs);
  const raw = readFileSync(abs, "utf8");
  const lines = raw.split("\n");
  const isCss = abs.endsWith(".css");

  // Excepciones declaradas
  const allow = new Map(); // nº de línea (1-based) → motivo
  lines.forEach((line, i) => {
    const m = line.match(/\/\*\s*lint-allow:?\s*(.*?)\s*\*\//) || line.match(/\/\/\s*lint-allow:?\s*(.*)$/);
    if (!m) return;
    const reason = m[1].trim();
    if (!reason) { errors.push(`${rel}:${i + 1} — lint-allow sin motivo`); return; }
    const pure = /^\s*(\/\*.*\*\/|\/\/.*)\s*$/.test(line);
    allow.set(i + 1, reason);
    if (pure) allow.set(i + 2, reason);
  });

  // Texto sin comentarios, conservando saltos de línea para no perder los números
  let text = raw;
  if (isCss) text = raw.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  else text = raw.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " ")).replace(/^\s*\/\/.*$/gm, (c) => " ".repeat(c.length));

  const lineOf = (idx) => text.slice(0, idx).split("\n").length;
  const report = (idx, rule, msg) => {
    const ln = lineOf(idx);
    if (allow.has(ln)) { allowed.push(`${rel}:${ln} [${rule}] ${allow.get(ln)}`); return; }
    errors.push(`${rel}:${ln} [${rule}] ${msg}`);
  };
  const noVars = (s) => s.replace(/var\([^)]*\)/g, " ");

  // color: hex y funciones en todo el archivo; nombres solo en propiedades de color (CSS)
  for (const m of text.matchAll(new RegExp(HEX.source, "gi"))) report(m.index, "color", `color literal ${m[0]} — usa un token (var(--color-…))`);
  for (const m of text.matchAll(new RegExp(FUNC.source, "gi"))) report(m.index, "color", `color literal ${m[0]}…) — usa un token (var(--color-…))`);
  if (isCss) {
    for (const m of text.matchAll(COLOR_PROPS)) {
      const named = noVars(m[2]).match(NAMED);
      if (named) report(m.index + m[0].indexOf(m[2]), "color", `color con nombre «${named[1]}» en ${m[1]} — usa un token`);
    }
  }

  if (isCss) {
    const checkPx = (re, rule, table, hint) => {
      for (const m of text.matchAll(re)) {
        const value = noVars(m[2]);
        for (const p of value.matchAll(PX)) {
          const n = Number(p[1]);
          if (n === 0) continue;
          const tok = table.get(Math.abs(n));
          const msg = tok
            ? `${m[1]}: ${p[0]} literal — usa var(${n < 0 ? "calc(-1 * " + tok + ")" : tok})`
            : `${m[1]}: ${p[0]} no está en la escala (${hint}) — usa un token o declara la excepción`;
          report(m.index + m[0].indexOf(m[2]), rule, msg);
        }
      }
    };
    checkPx(SPACING, "spacing", spaceByPx, "--space-*");
    checkPx(RADIUS, "radius", radiusByPx, "--radius-*");
  }

  // token: toda var(--x) debe existir en dist/tokens.css o declararse en este mismo archivo
  const local = new Set([...text.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
  for (const m of text.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
    if (!defined.has(m[1]) && !local.has(m[1])) report(m.index, "token", `${m[1]} no existe en dist/tokens.css`);
  }
}

if (allowed.length) {
  console.log(`Excepciones declaradas (${allowed.length}):`);
  for (const a of allowed) console.log(`  · ${a}`);
}
if (errors.length) {
  console.error(`\n✗ lint: ${errors.length} problema${errors.length === 1 ? "" : "s"}`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
const n = allowed.length;
console.log(`✓ lint: ${files.length} archivo${files.length === 1 ? "" : "s"} sin valores sueltos (${n} ${n === 1 ? "excepción declarada" : "excepciones declaradas"})`);
