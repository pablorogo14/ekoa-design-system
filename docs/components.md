# Componentes

`components/bundle.js` define `window.EKOA` con 12 componentes (React 18 como global, cargado antes). `components/bundle.css` es su hoja de estilos y necesita `dist/tokens.css`. Los tipos están en `components/index.d.ts`.

| Grupo | Componente | Para qué sirve | Props principales |
| --- | --- | --- | --- |
| Iconos | `Icon` | Icono de línea al estilo SF Symbols, cuadrícula de 24 pt, siempre en `currentColor`. | `name` (`compass`, `search`, `pin`, `person`, `chevronLeft`, `chevronRight`, `more`, `up`, `trash`, `pencil`), `size`, `filled`, `title` |
| Acciones | `Button` | Acción que se lanza con un toque; la etiqueta dice qué pasa al pulsarla. | `variant` (`primary`, `secondary`, `destructive`, `text`), `size` (`md`, `sm`), `block`, `loading`, `icon` |
| Acciones | `Chip` | Píldora para elegir una preferencia o filtrar una lista. | `selected`, `tone` (`default`, `tinted`) |
| Estado | `Badge` | Etiqueta de una o dos palabras con la categoría de un lugar. | `tone` (`nature`, `food`, `community`, `neutral`) |
| Formularios | `SegmentedControl` | Selector de 32 pt para 2 a 4 vistas del mismo contenido. | `options`, `value` / `defaultValue`, `onChange` |
| Formularios | `Switch` | Interruptor de 51 × 31 pt que aplica el cambio al momento. | `checked` / `defaultChecked`, `onChange`, `disabled`, `aria-label` |
| Formularios | `TextField` | Campo de una línea con etiqueta visible y un mensaje de ayuda o error. | `label`, `hint`, `error` + atributos de `<input>` |
| Listas | `GroupedList` | Contenedor de filas agrupadas (inset grouped de iOS). | `header`, `footer` |
| Listas | `ListRow` | Fila con icono opcional, título, subtítulo y elemento final. | `title`, `subtitle`, `icon`, `trailing`, `chevron`, `onClick` |
| Navegación | `NavigationBar` | Barra superior de 44 pt; con `large` el título pasa debajo en Archivo. | `title`, `large`, `back`, `onBack`, `trailing` |
| Navegación | `TabBar` | Barra inferior de 83 pt (49 pt de barra + 34 pt de zona segura). | `items`, `value`, `onChange` |
| Superposiciones | `Sheet` | Hoja modal sobre un velo, con tirador, título en Archivo y botón de cerrar visible. | `title`, `closeLabel`, `onClose` |

## Uso mínimo

```html
<link rel="stylesheet" href="dist/tokens.css" />
<link rel="stylesheet" href="components/bundle.css" />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&display=swap" rel="stylesheet" />
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="components/bundle.js"></script>
<script>
  const { Button } = window.EKOA;
  ReactDOM.createRoot(document.getElementById("root")).render(
    React.createElement(Button, { variant: "primary" }, "Generar viaje")
  );
</script>
```

Para el tema oscuro, pon `data-theme="dark"` en `<html>` (o en cualquier contenedor).
