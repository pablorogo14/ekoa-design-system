#!/usr/bin/env node
// Validador mínimo del formato Design Tokens (DTCG 2025.10), sin dependencias.
// Comprueba: $value/$type presentes, estructura de color/dimension/shadow/typography,
// referencias resolubles y que los temas claro y oscuro tengan las mismas claves.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "tokens");
const FILES = ["primitives", "core", "theme-light", "theme-dark"];
const docs = Object.fromEntries(FILES.map((f) => [f, JSON.parse(readFileSync(join(dir, `${f}.tokens.json`), "utf8"))]));
const errors = [];
const err = (file, path, msg) => errors.push(`${file}: ${path.join(".")} — ${msg}`);

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const isRef = (v) => typeof v === "string" && /^\{[^{}]+\}$/.test(v);
const UNITS = new Set(["px", "rem"]);
const WEIGHTS = new Set(["thin","hairline","extra-light","ultra-light","light","normal","regular","book","medium","semi-bold","demi-bold","bold","extra-bold","ultra-bold","black","heavy","extra-black","ultra-black"]);

function walk(file, node, path, inheritedType, out) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (/[.{}]/.test(k)) err(file, [...path, k], "el nombre no puede contener '.', '{' ni '}'");
    if (!isObj(v)) { err(file, [...path, k], "se esperaba un objeto"); continue; }
    if ("$value" in v) {
      const type = v.$type ?? inheritedType;
      if (!type) err(file, [...path, k], "token sin $type (ni propio ni heredado)");
      out.push({ file, path: [...path, k], type, value: v.$value });
    } else {
      walk(file, v, [...path, k], v.$type ?? inheritedType, out);
    }
  }
}

const tokens = [];
for (const f of FILES) walk(f, docs[f], [], docs[f].$type, tokens);
const byRef = new Map(tokens.map((t) => [t.path.join("."), t]));

function checkDim(t, d, label) {
  if (isRef(d)) return;
  if (!isObj(d) || typeof d.value !== "number" || !UNITS.has(d.unit)) err(t.file, t.path, `${label}: dimension inválida (value numérico y unit px|rem)`);
}
function checkColor(t, c) {
  if (isRef(c)) return;
  const ok = isObj(c) && c.colorSpace === "srgb" && Array.isArray(c.components) && c.components.length === 3 &&
    c.components.every((n) => typeof n === "number" && n >= 0 && n <= 1) &&
    (c.alpha === undefined || (typeof c.alpha === "number" && c.alpha >= 0 && c.alpha <= 1)) &&
    (c.hex === undefined || /^#[0-9a-f]{6}$/i.test(c.hex));
  if (!ok) err(t.file, t.path, "color inválido (srgb, 3 componentes 0–1, alpha 0–1, hex #rrggbb)");
}
function checkFamily(t, f) {
  if (isRef(f)) return;
  const ok = typeof f === "string" || (Array.isArray(f) && f.length > 0 && f.every((s) => typeof s === "string"));
  if (!ok) err(t.file, t.path, "fontFamily inválida");
}
function checkWeight(t, w) {
  if (isRef(w)) return;
  if (!((typeof w === "number" && w >= 1 && w <= 1000) || WEIGHTS.has(w))) err(t.file, t.path, "fontWeight inválido");
}

for (const t of tokens) {
  const v = t.value;
  switch (t.type) {
    case "color": checkColor(t, v); break;
    case "dimension": checkDim(t, v, "valor"); break;
    case "fontFamily": checkFamily(t, v); break;
    case "fontWeight": checkWeight(t, v); break;
    case "shadow": {
      for (const s of Array.isArray(v) ? v : [v]) {
        if (isRef(s)) continue;
        checkColor(t, s.color);
        for (const k of ["offsetX", "offsetY", "blur", "spread"]) checkDim(t, s[k], k);
      }
      break;
    }
    case "typography": {
      if (!isObj(v)) { err(t.file, t.path, "typography debe ser un objeto"); break; }
      checkFamily(t, v.fontFamily); checkDim(t, v.fontSize, "fontSize"); checkWeight(t, v.fontWeight);
      checkDim(t, v.letterSpacing, "letterSpacing");
      if (!isRef(v.lineHeight) && typeof v.lineHeight !== "number") err(t.file, t.path, "lineHeight debe ser un número");
      break;
    }
    default: err(t.file, t.path, `$type no soportado por este validador: ${t.type}`);
  }
  // referencias: cualquier cadena "{a.b}" dentro del valor
  const scan = (x) => {
    if (isRef(x)) { if (!byRef.has(x.slice(1, -1))) err(t.file, t.path, `referencia sin resolver ${x}`); }
    else if (Array.isArray(x)) x.forEach(scan);
    else if (isObj(x)) Object.values(x).forEach(scan);
  };
  scan(v);
}

// Los colores de los temas deben apuntar a un primitivo, salvo los translúcidos (alpha < 1).
for (const t of tokens) {
  if (!t.file.startsWith("theme-") || t.type !== "color") continue;
  const v = t.value;
  if (isRef(v)) { if (!v.startsWith("{palette.")) err(t.file, t.path, "la referencia debe apuntar a un primitivo ({palette.*})"); }
  else if (!(isObj(v) && typeof v.alpha === "number" && v.alpha < 1)) err(t.file, t.path, "los colores semánticos deben ser una referencia a {palette.*} (solo los translúcidos llevan valor directo)");
}

// Paridad entre temas
const keys = (f) => new Set(tokens.filter((t) => t.file === f).map((t) => t.path.join(".")));
const L = keys("theme-light"), D = keys("theme-dark");
for (const k of L) if (!D.has(k)) errors.push(`theme-dark: falta ${k}`);
for (const k of D) if (!L.has(k)) errors.push(`theme-light: falta ${k}`);

if (errors.length) {
  console.error(errors.map((e) => "✗ " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${tokens.length} tokens válidos (DTCG 2025.10) · ${L.size} colores en cada tema`);
