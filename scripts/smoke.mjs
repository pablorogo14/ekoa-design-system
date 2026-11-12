#!/usr/bin/env node
// Prueba de humo: carga components/bundle.js con React 18 y renderiza cada componente a HTML.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const sandbox = { window: { React }, console };
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(root, "components", "bundle.js"), "utf8"), sandbox);
const E = sandbox.window.EKOA;
const h = React.createElement;

const cases = {
  Icon: h(E.Icon, { name: "compass", filled: true }),
  Button: h(E.Button, { variant: "primary" }, "Generar viaje"),
  Chip: h(E.Chip, { selected: true }, "Naturaleza"),
  Badge: h(E.Badge, { tone: "nature" }, "Naturaleza"),
  SegmentedControl: h(E.SegmentedControl, { options: [{ value: "a", label: "A" }, { value: "b", label: "B" }] }),
  Switch: h(E.Switch, { defaultChecked: true, "aria-label": "Avisos" }),
  TextField: h(E.TextField, { label: "Destino", error: "Escribe un destino" }),
  GroupedList: h(E.GroupedList, { header: "Cerca de ti" }, h(E.ListRow, { title: "Sierra de Cazorla", subtitle: "2 h", icon: "pin", onClick() {} })),
  ListRow: h(E.ListRow, { title: "Fila" }),
  NavigationBar: h(E.NavigationBar, { title: "Tus viajes", large: true, back: "Atrás" }),
  TabBar: h(E.TabBar, { value: "d", items: [{ id: "d", label: "Descubre", icon: "compass" }, { id: "p", label: "Perfil", icon: "person" }] }),
  Sheet: h(E.Sheet, { title: "Editar itinerario" }, "Contenido"),
};

const missing = Object.keys(cases).filter((k) => typeof E[k] !== "function");
if (missing.length || Object.keys(E).length !== 12) {
  console.error("✗ componentes esperados: 12, expuestos:", Object.keys(E).join(", "), missing);
  process.exit(1);
}
for (const [name, el] of Object.entries(cases)) {
  const html = renderToStaticMarkup(el);
  if (!html || !html.includes("ek-")) { console.error(`✗ ${name} no renderiza clases ek-*`); process.exit(1); }
}
console.log(`✓ ${Object.keys(cases).length} componentes renderizan sin errores`);
