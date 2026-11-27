# DESIGN.md · EKOA

Mapa del design system. Aquí solo hay dónde está cada cosa y qué no se hace; el detalle vive en los archivos enlazados.

## Dónde está cada cosa

| Necesito… | Mira en |
| --- | --- |
| Colores (primitivos y semánticos), espaciado, radios, sombras, tipografía | `tokens/*.tokens.json` (fuente) y `dist/tokens.css` (generado, lo que usa el código) |
| Un componente que ya exista | `docs/components.md` (nombre, para qué sirve, props) y `components/index.d.ts` |
| Criterio de contenido, color, tipografía, navegación y toque | `docs/guidelines.md` |
| Ver el sistema renderizado | `index.html` (hay que servirlo por HTTP) |

Antes de crear algo nuevo, busca en `docs/components.md`: si existe, se reutiliza.

## Reglas que el build comprueba (`npm run check`)

Si las incumples, el build falla; no hay avisos.

- **Ningún color literal** en `components/` (`#hex`, `rgb()`, `white`…): usa `var(--color-…)` o el alias del token.
- **Ningún px literal** en `padding`, `margin`, `gap` ni `border-radius`: usa `var(--space-N)` o `var(--radius-…)`.
- **Ningún `var(--x)` inventado**: toda variable debe existir en `dist/tokens.css`.
- **Los colores semánticos apuntan a la paleta** (`{palette.familia.paso}`); solo los translúcidos llevan valor propio.
- **Tokens válidos** (DTCG 2025.10) y temas claro y oscuro con las mismas claves.
- Una excepción se declara con `/* lint-allow: motivo */` en la línea de encima. El motivo es obligatorio y se lista en cada ejecución.

## Reglas que NO comprueba el build (se cumplen a mano)

- No añadas variantes de botón ni componentes nuevos sin decidirlo antes.
- Categorías solo Naturaleza, Gastronomía y Comunidad local.
- Archivo solo de Title 3 hacia arriba; de Headline hacia abajo, SF Pro.
- Todo control pulsable mide al menos `tap-min` (44 pt).
- No uses `ink-faint` para texto ni iconos que informen.
- No reutilices `moss` ni `clay` para parques o agua: hay tokens de mapa.
- El estado nunca se comunica solo con color.

## Cómo se cambia el sistema

1. Edita el token en `tokens/` (nunca `dist/` a mano).
2. `npm run check` (valida, regenera `dist/`, lint y smoke test) y sube `dist/` con el cambio.
3. Cambia por rama y PR; `main` no se toca directo.
4. El repo manda: Figma se alinea con él, no al revés.
