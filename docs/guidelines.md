# Guía de uso de EKOA

EKOA es una app de iPhone de viajes sostenibles: un guía de IA propone itinerarios con experiencias de proximidad y bajo impacto. El sistema sigue las convenciones de iOS (barras translúcidas, título grande, listas agrupadas, hojas modales, tab bar inferior) con calidez de papel y de mapa. Los componentes de `components/` están hechos para pantallas de iPhone; si algo no existe en el sistema, resuélvelo con el componente nativo de iOS equivalente y los tokens de aquí.

## Fundamentos de contenido

- Escribe en español, en tono cercano y claro, tuteando: "¿Cuántos días quieres que dure el viaje?", "Generando tu viaje…". Cada afirmación se apoya en un dato concreto, sin superlativos ni signos de exclamación.
- Nombra las cosas por lo que la persona controla: "viaje" e "itinerario", no "sesión" ni "registro". Elige una palabra por concepto y úsala en toda la app. Las categorías son Naturaleza, Gastronomía y Comunidad local; no añadas otras sin decidirlo antes.
- Escribe en mayúscula inicial de frase, no en Title Case: "Plan exprés", "Descubre lugares secretos", "Ruta gastronómica". Solo los rótulos de grupo (`eyebrow`) van en mayúsculas.
- Los botones dicen qué pasa al pulsarlos: "Generar viaje", "Eliminar día", nunca "Enviar", "OK" o "Continuar" sueltos. Los destructivos nombran la consecuencia. Mientras se carga, el botón conserva el verbo en gerundio: "Generando viaje…".
- Un error tiene tres partes: qué pasó, por qué si ayuda y qué hacer. "No hemos podido generar el viaje. Comprueba tu conexión e inténtalo de nuevo." con el botón "Reintentar"; nunca "Ha ocurrido un error".
- Un estado vacío invita, no despide: qué está vacío, qué puede hacer la persona y un botón. "Aún no tienes viajes. Pídele a tu guía un primer itinerario." con "Crear un viaje". Nunca "Sin datos".
- Antes de pedir un permiso, explica para qué sirve: "Para proponerte lugares cerca de ti", no "Permitir ubicación".
- En el chat del guía haz una sola pregunta por turno y no repitas lo que la persona ya dijo en el onboarding.
- Separa los datos de una línea con " · " ("Sierra de Cazorla · 2 h", "Km 0 · Comercio justo"). Precios y horas: "12€", "09:00 - 18:00".
- Sin emoji como decoración.

## Fundamentos visuales

**Lienzo.** Diseña para iPhone de 390 × 844 pt (`screen-w`, `screen-h`) con márgenes de `screen-margin`. La zona segura superior es `safe-top` (59 pt) y la inferior `safe-bottom` (34 pt): el contenido no empieza dentro de la primera y ningún control pulsable entra en la segunda. Las medidas están en pt, que equivalen a px a @1x. Pon `screen-margin` a los lados y no fijes alturas de texto: con Dynamic Type crece, usa `min-height` y relleno.

**Color.** `paper` es el fondo de pantalla (systemGroupedBackground) y `card` las tarjetas, listas agrupadas y campos (secondarySystemGroupedBackground); `card-alt` para superficies neutras secundarias. El texto es `ink` (label), con `ink-soft` para lo secundario (secondaryLabel); `hairline` separa (separator) y `border-strong` (`--color-border-strong`) dibuja el contorno de los campos. El acento de marca, `moss`, se redujo al mínimo: hoy solo aparece en la categoría Naturaleza (badge y portada por defecto, con `moss-weak` de fondo) y en el nivel medio del gráfico de afluencia. `ink` cubre el resto de rellenos y acentos interactivos que antes eran `moss`: botón primario (texto `paper`), botón secundario y chip tinted (fondo `card-alt`), chip seleccionado (texto `paper`), burbuja del usuario, switch activo, pin del mapa, tab e icono de fila activos, anillo de foco y enlaces. `clay` marca Gastronomía y el nivel medio de un gráfico, con `clay-text` como texto sobre `clay-weak`. `danger` (systemRed) es para acciones destructivas y el nivel alto de afluencia; su texto es `danger-text` sobre `danger-weak`. No uses `ink-faint` para texto ni para iconos que informen. Los dos temas (claro y oscuro) cambian solos: no escribas hex en los componentes.

**Estados.** Aviso es `clay` y error es `danger`; el éxito ya no tiene un color propio en la app — comunícalo con `ink` y texto o icono, nunca solo con color.

**Tipografía.** Los títulos y el texto muy grande van en Archivo desde Title 3 hacia arriba (`display`, `large-title`, `title-1`, `title-2`, `title-3`); de Headline hacia abajo todo va en SF Pro (`headline`, `body`, `callout`, `subheadline`, `footnote`, `caption-1`, `caption-2`, más `eyebrow` y `badge`). La escala sigue los estilos de texto de iOS con sus mismos tamaños. No mezcles: un título en SF Pro o un párrafo en Archivo rompe el sistema. SF Pro se pide con la pila del sistema (`-apple-system`, `SF Pro Text`) porque Apple no permite redistribuir el archivo; en iOS es la fuente real y fuera de Apple cae a `system-ui`. Archivo se carga desde Google Fonts con los pesos 700 y 800. El texto de lectura no baja de `footnote` (13 pt).

**Forma.** Esquinas con suavizado de iOS (corner smoothing 60 % en Figma): listas agrupadas y tarjetas con `radius-lg`, tarjetas de lugar con `radius-md`, botones con `radius-btn`, campos con `radius-sm`, hojas con `radius-sheet`, chips, badges y switches con `radius-pill`. Las tarjetas van planas; solo la hoja del mapa (`shadow-sheet`), los controles flotantes (`shadow-float`) y el segmento activo (`shadow-segment`) llevan sombra. Prefiere espacio en blanco a más separadores.

**Navegación.** La navegación principal es una tab bar inferior de 3 a 5 tabs (`tab-bar-h`, 83 pt) y arriba una barra de navegación de `nav-bar-h` (44 pt) con título grande en las pantallas raíz. Volver va arriba a la izquierda con chevrón y el título de la pantalla anterior, y también con el gesto de deslizar desde el borde. Las barras usan `bar` con blur (saturate 180 %, blur 18 pt) y un `hairline` de 0,5 pt. Las opciones secundarias abren una hoja desde abajo (`Sheet`) y se cierran deslizando hacia abajo; no apiles más de un nivel de hojas.

**Toque.** Todo control pulsable tiene un área de al menos `tap-min` (44 pt) y 8 pt (`space-8`) de separación con el siguiente. Botones principales de `button-h` (50 pt). No hay estado hover: el estado pulsado reduce el botón a `scale(.97)` en 80 ms o aclara la fila con `card-alt`. Los gestos (deslizar para borrar, arrastrar la hoja) siempre tienen una alternativa visible. Un botón desactivado baja al 40 % de opacidad y la pantalla explica por qué.

**Foco.** El anillo de foco es de 2 pt en `ink` con separación de 2 pt, y solo aparece con teclado o Switch Control. Respeta `prefers-reduced-motion` y quita las transiciones.

**Mapas.** Las ilustraciones de mapa usan base crema (`map-base`), parques verde salvia (`map-park`), agua azul suave (`map-water`) y trazos de carretera (`map-road`), dibujados en SVG. No reutilices `moss` ni `clay` para agua o parques: son tokens propios, con su versión oscura.

## Iconografía

Usa el componente `Icon`: iconos de línea al estilo SF Symbols, cuadrícula de 24 pt, trazo de 1,7 (2,2 en chevrones), terminales y uniones redondeados, siempre en `currentColor`. La variante rellena se reserva para la tab activa; la tab activa va en `ink` y las inactivas en `ink-soft`. Un icono que va solo lleva nombre accesible y un área táctil de 44 pt. No mezcles otra familia de iconos.
