# EKOA · Design system

Design system de **EKOA**, una app de iPhone de viajes sostenibles. Sigue las convenciones de iOS con un tono cálido de papel y mapa. Incluye tokens de diseño y 12 componentes React.

- **Tokens** en formato [Design Tokens (DTCG) 2025.10](https://www.designtokens.org/), la primera versión estable del estándar del W3C Design Tokens Community Group.
- **Componentes** en `components/`, con React 18 como global y tipos TypeScript.
- **Guía de uso** (contenido, color, tipografía, forma, navegación, toque): [`docs/guidelines.md`](docs/guidelines.md).
- **Catálogo de componentes**: [`docs/components.md`](docs/components.md).
- **Vista visual**: abre `index.html` servido por HTTP (ver más abajo).

## Estructura

```
tokens/
  core.tokens.json          tipografía, espaciado, radios, sombras, layout, fuentes
  theme-light.tokens.json   colores, tema claro (con las notas de uso y contraste)
  theme-dark.tokens.json    colores, tema oscuro (mismas claves que el claro)
dist/tokens.css             variables CSS y clases tipográficas (generado)
components/
  bundle.js                 define window.EKOA (necesita window.React)
  bundle.css                estilos de los componentes (necesita dist/tokens.css)
  index.d.ts                tipos
docs/                       guía de uso y catálogo de componentes
scripts/                    validate.mjs, build.mjs, smoke.mjs
index.html                  página de documentación visual
```

## Estándares que cumple

- Tokens con `$type`, `$value` y `$description`; colores en `srgb` con `components`, `alpha` y `hex`; dimensiones como `{ value, unit }` en `px`; tipografía y sombra como tokens compuestos; referencias con `{font.family.display}`.
- Extensión de archivo `.tokens.json`, aceptada por la especificación.
- Los temas claro y oscuro son archivos separados con las mismas claves. El validador comprueba que coinciden.
- Los datos propios que la especificación no cubre van en `$extensions` con la clave `com.ekoa` (altura de línea exacta en px, espaciado de letras en em y `text-transform` del `eyebrow`).
- El espaciado de letras se convirtió de em a px porque DTCG solo admite `px` y `rem`. Las clases CSS generadas conservan el valor en em.

## Comandos

```bash
npm install
npm run validate   # valida los tokens contra DTCG 2025.10
npm run build      # regenera dist/tokens.css
npm test           # renderiza los 12 componentes
npm run check      # las tres cosas
```

Después de tocar un `.tokens.json`, ejecuta `npm run build` y sube también `dist/`. El flujo de CI (`.github/workflows/check.yml`) falla si `dist/` no está al día.

## Verlo en el navegador

`index.html` lee los tokens con `fetch`, así que necesita un servidor:

```bash
npx serve .
```

Para publicarlo, activa GitHub Pages desde la rama principal y la carpeta raíz. También sirve Netlify apuntando a la raíz, sin comando de build.

## Uso

Detalle y ejemplo mínimo en [`docs/components.md`](docs/components.md). Para el tema oscuro, pon `data-theme="dark"` en `<html>` o en un contenedor.

## Pendientes conocidos

Vienen del artefacto original y no se han corregido aquí:

1. **`moss` en el tema oscuro** sigue en el verde azulado anterior (`#6eb9b2`), mientras que el claro pasó a verde oliva (`#626549`). Hay que decidir si se alinea o si la diferencia es intencionada.
2. **`ink-soft` sobre `card-alt` en el tema claro** da 4,2:1, por debajo del objetivo de 4,5:1.
3. **Archivo no está autoalojada**: se carga desde Google Fonts (pesos 700 y 800). `dist/tokens.css` no incluye `@font-face`.
4. **`switch-off` en el tema claro** (`#e9e9ea`) casi no se distingue del fondo `paper`; el estado apagado depende de la posición de la perilla.

## Licencia

Todos los derechos reservados. El código y los tokens se publican para consulta como parte de un porfolio, y no se concede permiso para reutilizarlos ni redistribuirlos.

## Origen

Exportado del artefacto "EKOA" (tipo Design System) de Claude, versión del 22/09/2026. Los tokens se convirtieron del formato propio del artefacto a DTCG; los componentes son idénticos byte a byte a los del artefacto.
