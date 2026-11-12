(function () {
  'use strict';
  var REPO = 'https://github.com/pablorogo14/ekoa-design-system';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var leaf = function (g) { return Object.keys(g).filter(function (k) { return k[0] !== '$'; }).map(function (k) { return [k, g[k]]; }); };

  /* ---------- datos ---------- */
  var SECTIONS = [
    { id: 'overview', label: 'Resumen', icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>' },
    { id: 'colors', label: 'Color', icon: '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="15.5" cy="10" r="1"/>' },
    { id: 'type', label: 'Tipografía', icon: '<path d="M4 19l6-14 6 14M6.5 14h7M17 10h3m-1.5 0v8"/>' },
    { id: 'spacing', label: 'Espaciado', icon: '<path d="M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3"/>' },
    { id: 'radius', label: 'Radios', icon: '<path d="M5 19V11a6 6 0 0 1 6-6h8"/>' },
    { id: 'shadows', label: 'Sombras', icon: '<rect x="4" y="4" width="13" height="13" rx="2"/><path d="M8 20h12V8"/>' },
    { id: 'layout', label: 'Layout', icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M4 17h16"/>' },
    { id: 'components', label: 'Componentes', icon: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>' }
  ];
  var COLOR_GROUPS = [
    ['Superficies', ['paper', 'card', 'card-alt', 'bar', 'scrim']],
    ['Texto y líneas', ['ink', 'ink-soft', 'ink-faint', 'hairline']],
    ['Moss · Naturaleza', ['moss', 'moss-weak', 'moss-contrast']],
    ['Clay · Gastronomía y avisos', ['clay', 'clay-weak', 'clay-text']],
    ['Danger · Errores y acciones destructivas', ['danger', 'danger-weak', 'danger-text']],
    ['Switch', ['switch-off', 'knob']],
    ['Mapas', ['map-base', 'map-park', 'map-water', 'map-road']]
  ];
  var TYPE_GROUPS = [
    ['Títulos (Archivo)', ['display', 'large-title', 'title-1', 'title-2', 'title-3']],
    ['Texto (SF Pro)', ['headline', 'body', 'callout', 'subheadline', 'subheadline-strong', 'footnote', 'caption-1', 'caption-2', 'eyebrow', 'badge']]
  ];
  var SAMPLES = {
    display: 'Viaja con calma', 'large-title': 'Tus viajes', 'title-1': 'Fin de semana en Cazorla', 'title-2': 'Día 1 · sábado', 'title-3': 'Editar itinerario',
    headline: 'Cooperativa Oliva Verde', body: 'Ruta corta y accesible con vistas al Parque Natural.', callout: 'Aceite ecológico con cata guiada',
    subheadline: 'Sierra de Cazorla · 2 h', 'subheadline-strong': 'Guardar', footnote: 'Km 0 · Comercio justo', 'caption-1': 'Actualizado hoy',
    'caption-2': 'Explorar', eyebrow: 'Cerca de ti', badge: 'Naturaleza'
  };
  var WEIGHTS = { 800: 'Heavy', 700: 'Bold', 600: 'Semibold', 500: 'Medium', 400: 'Regular' };
  var COMPONENTS = [
    ['Icon', 'Iconos', 'Línea de 1,7 pt, 24 pt de cuadrícula', 390, 280, 'Icono de línea al estilo SF Symbols, en cuadrícula de 24 pt con trazo de 1,7 (2,2 en los chevrones), terminales redondeados y siempre en currentColor.'],
    ['Button', 'Acciones', 'Primario, secundario, destructivo y texto', 390, 340, 'Acción que la persona lanza con un toque; la etiqueta dice qué pasa al pulsarla.'],
    ['Chip', 'Acciones', 'Filtro o preferencia, seleccionable', 390, 180, 'Píldora para elegir una preferencia o filtrar una lista, con estado seleccionado.'],
    ['Badge', 'Estado', 'Categoría en una píldora', 390, 80, 'Etiqueta de una o dos palabras que nombra la categoría de un lugar o actividad.'],
    ['SegmentedControl', 'Formularios', 'Alterna entre 2 a 4 vistas', 390, 130, 'Selector de 32 pt para cambiar entre dos a cuatro vistas del mismo contenido, como en iOS.'],
    ['Switch', 'Formularios', 'Interruptor de 51 × 31 pt', 390, 90, 'Interruptor de dos estados de 51 × 31 pt que aplica el cambio al momento.'],
    ['TextField', 'Formularios', 'Campo con etiqueta, ayuda y error', 390, 370, 'Campo de texto de una línea con la etiqueta visible encima y un mensaje de ayuda o de error debajo.'],
    ['GroupedList', 'Listas', 'Lista agrupada con filas y cabecera', 390, 500, 'Contenedor de filas agrupadas al estilo inset grouped de iOS, sobre card con esquinas radius-lg.'],
    ['ListRow', 'Listas', 'Fila con icono, título y subtítulo', 390, 120, 'Fila de una GroupedList con icono opcional, título, subtítulo y elemento final; con onClick es pulsable y muestra un chevrón.'],
    ['NavigationBar', 'Navegación', 'Barra de 44 pt, en línea o con título grande', 390, 230, 'Barra superior translúcida de 44 pt con botón de volver, título centrado y hasta dos acciones; con large el título pasa debajo en Archivo (large-title).'],
    ['TabBar', 'Navegación', 'Navegación principal de 83 pt', 390, 130, 'Barra inferior de navegación principal de 83 pt: 49 pt de barra y 34 pt de zona segura para el indicador de inicio.'],
    ['Sheet', 'Superposiciones', 'Hoja inferior con velo', 390, 400, 'Hoja modal que sube desde abajo sobre un velo scrim, con tirador, título en Archivo (title-3) y un botón visible para cerrarla.']
  ];
  var FILES = [
    ['tokens/', 'Tokens en formato DTCG 2025.10: core, tema claro y tema oscuro.'],
    ['dist/tokens.css', 'Variables CSS y clases tipográficas (generado desde los tokens).'],
    ['components/bundle.js', 'Los 12 componentes React (define window.EKOA).'],
    ['components/bundle.css', 'Estilos de los componentes.'],
    ['components/index.d.ts', 'Tipos TypeScript.'],
    ['docs/guidelines.md', 'Guía de uso: contenido, color, tipografía, forma, navegación y toque.'],
    ['docs/components.md', 'Catálogo de componentes y ejemplo mínimo.']
  ];

  /* ---------- utilidades ---------- */
  function cssColor(c) {
    var rgb = c.components.map(function (x) { return Math.round(x * 255); });
    var a = c.alpha === undefined ? 1 : c.alpha;
    if (a === 1) return c.hex || '#' + rgb.map(function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
    return 'rgba(' + rgb.join(',') + ',' + a + ')';
  }
  function dimText(d) { return d.value + ' ' + d.unit; }
  function famCss(arr) { return arr.map(function (s) { return /\s/.test(s) || s === 'Archivo' ? '"' + s + '"' : s; }).join(', '); }
  function inline(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
  function markdown(md) {
    var out = [], list = false, first = true;
    md.split('\n').forEach(function (line) {
      if (/^# /.test(line)) { return; }
      if (/^- /.test(line)) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + inline(line.slice(2)) + '</li>'); return; }
      if (list) { out.push('</ul>'); list = false; }
      if (/^## /.test(line)) { out.push('<h2>' + inline(line.slice(3)) + '</h2>'); return; }
      if (line.trim()) { out.push('<p' + (first ? ' class="lead"' : '') + '>' + inline(line) + '</p>'); first = false; }
    });
    if (list) out.push('</ul>');
    return out.join('\n');
  }
  function tableOf(head, rows, cls) {
    return '<table' + (cls ? ' class="' + cls + '"' : '') + '><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  /* ---------- estado ---------- */
  var T = null, theme = 'light', SEARCH = [];
  var view = $('#view'), nav = $('#nav');

  function load() {
    var get = function (f) { return fetch('tokens/' + f + '.tokens.json').then(function (r) { if (!r.ok) throw new Error(f); return r.json(); }); };
    return Promise.all([get('core'), get('theme-light'), get('theme-dark'), fetch('docs/guidelines.md').then(function (r) { return r.text(); })])
      .then(function (r) { T = { core: r[0], light: r[1], dark: r[2], md: r[3] }; });
  }

  /* ---------- secciones ---------- */
  var R = {};

  R.overview = function () {
    view.innerHTML = '<h1 class="sr" style="position:absolute;left:-9999px">EKOA</h1>' +
      '<div class="cover" id="cover"><iframe src="previews/cover.html" title="Portada de EKOA" loading="lazy"></iframe></div>' +
      '<div class="prose" style="margin-top:24px">' + markdown(T.md) + '</div>';
    var box = $('#cover'), fr = $('iframe', box);
    var fit = function () { var s = box.clientWidth / 960; fr.style.transform = 'scale(' + s + ')'; box.style.height = 320 * s + 'px'; };
    fit(); window.onresize = fit;
  };

  R.colors = function () {
    var light = T.light.color, dark = T.dark.color, used = {};
    var html = '<h1>Color</h1>';
    COLOR_GROUPS.forEach(function (g) {
      var rows = g[1].filter(function (k) { return light[k]; }).map(function (k) {
        used[k] = 1;
        var l = cssColor(light[k].$value), d = cssColor(dark[k].$value);
        return '<tr><td class="name">' + k + '<div class="note">--' + k + '</div></td>' +
          '<td><div class="sw" style="--c:' + l + '"><i></i><span>' + l + '</span></div></td>' +
          '<td><div class="sw" style="--c:' + d + '"><i></i><span>' + d + '</span></div></td>' +
          '<td><div class="usage">' + esc(light[k].$description || '') + '</div></td></tr>';
      });
      html += '<h2 class="group">' + g[0] + '</h2>' + tableOf(['Nombre', 'Claro', 'Oscuro', 'Uso'], rows);
    });
    view.innerHTML = html;
  };

  R.type = function () {
    var fam = T.core.font.family, text = T.core.text;
    var html = '<h1>Tipografía</h1>';
    TYPE_GROUPS.forEach(function (g) {
      var rows = g[1].map(function (k) {
        var t = text[k], v = t.$value, ext = (t.$extensions || {})['com.ekoa'] || {};
        var f = v.fontFamily.indexOf('display') > -1 ? fam.display : fam.sans;
        var family = v.fontFamily.indexOf('display') > -1 ? 'Archivo' : 'SF Pro';
        var ls = ext.letterSpacingEm ? String(ext.letterSpacingEm).replace('.', ',').replace('-', '−') + ' em' : '0 em';
        var st = 'font-family:' + famCss(f.$value) + ';font-size:' + v.fontSize.value + 'px;line-height:' + (ext.lineHeightPx || Math.round(v.fontSize.value * v.lineHeight)) + 'px;font-weight:' + v.fontWeight + ';letter-spacing:' + (ext.letterSpacingEm ? ext.letterSpacingEm + 'em' : '0') + (ext.textTransform ? ';text-transform:' + ext.textTransform : '');
        return '<tr><td class="name">' + k + '</td><td><div class="sample" style="' + esc(st) + '">' + esc(SAMPLES[k] || k) + '</div>' +
          '<div class="note">' + family + ' · ' + v.fontSize.value + '/' + (ext.lineHeightPx || '') + ' px · ' + (WEIGHTS[v.fontWeight] || v.fontWeight) + ' · ' + ls + '</div>' +
          '<div class="usage" style="margin-top:4px">' + esc(t.$description || '') + '</div></td></tr>';
      });
      html += '<h2 class="group">' + g[0] + '</h2>' + tableOf(['Nombre', 'Vista previa'], rows);
    });
    html += '<p class="note" style="margin-top:16px">Archivo se carga desde Google Fonts (700 y 800). SF Pro se pide con la pila del sistema: en Windows y Android cae a otra sans.</p>';
    view.innerHTML = html;
  };

  R.spacing = function () {
    var rows = leaf(T.core.space).map(function (e) {
      return '<tr><td class="name">space-' + e[0] + '</td><td class="mono">' + dimText(e[1].$value) + '</td><td><span class="bar" style="width:' + e[1].$value.value + 'px"></span></td><td><div class="usage">' + esc(e[1].$description) + '</div></td></tr>';
    });
    view.innerHTML = '<h1>Espaciado</h1><p class="note" style="margin:-8px 0 16px">' + esc(T.core.space.$description) + '</p>' + tableOf(['Nombre', 'Valor', 'Muestra', 'Uso'], rows);
  };

  R.radius = function () {
    var rows = leaf(T.core.radius).map(function (e) {
      return '<tr><td class="name">radius-' + e[0] + '</td><td class="mono">' + dimText(e[1].$value) + '</td><td><div class="box" style="border-radius:' + e[1].$value.value + 'px"></div></td><td><div class="usage">' + esc(e[1].$description) + '</div></td></tr>';
    });
    view.innerHTML = '<h1>Radios</h1><p class="note" style="margin:-8px 0 16px">' + esc(T.core.radius.$description) + '</p>' + tableOf(['Nombre', 'Valor', 'Muestra', 'Uso'], rows);
  };

  R.shadows = function () {
    var rows = leaf(T.core.shadow).map(function (e) {
      var s = e[1].$value, v = [s.offsetX, s.offsetY, s.blur, s.spread].map(function (d) { return d.value + 'px'; });
      var css = v[0] + ' ' + v[1] + ' ' + v[2] + ' ' + cssColor(s.color);
      return '<tr><td class="name">shadow-' + e[0] + '</td><td class="mono">' + esc(css) + '</td><td><div class="shadow-box" style="box-shadow:' + css + '"></div></td><td><div class="usage">' + esc(e[1].$description) + '</div></td></tr>';
    });
    view.innerHTML = '<h1>Sombras</h1><p class="note" style="margin:-8px 0 16px">' + esc(T.core.shadow.$description) + '</p>' + tableOf(['Nombre', 'Valor', 'Muestra', 'Uso'], rows);
  };

  R.layout = function () {
    var L = T.core.layout, rows = leaf(L).map(function (e) {
      return '<tr><td class="name">' + e[0] + '</td><td class="mono">' + dimText(e[1].$value) + '</td><td><div class="usage">' + esc(e[1].$description) + '</div></td></tr>';
    });
    view.innerHTML = '<h1>Layout</h1><p class="note" style="margin:-8px 0 8px">' + esc(L.$description) + '</p>' +
      '<div class="diagram"><div class="phone" role="img" aria-label="Lienzo de iPhone con zonas seguras y barras">' +
      '<div class="st">safe-top 59</div><div class="nb">nav-bar 44</div><div class="mg">screen-margin 16</div><div class="tb">tab-bar 49</div><div class="sb">safe-bottom 34</div></div>' +
      '<div class="note" style="max-width:260px">Lienzo de 390 × 844 pt a la mitad de su tamaño. Las zonas de color son las que ocupan el sistema y la barra de navegación; el contenido va entre ellas.</div></div>' +
      tableOf(['Nombre', 'Valor', 'Uso'], rows);
  };

  R.components = function () {
    var rows = COMPONENTS.map(function (c) {
      return '<tr><td><b>' + c[0] + '</b><p>' + esc(c[5]) + '</p><span class="grp">' + c[1] + '</span></td>' +
        '<td class="pv"><iframe class="frame" title="' + c[0] + '" loading="lazy" width="' + c[3] + '" height="' + c[4] + '" data-c="' + c[0] + '" src="previews/frame.html?c=' + c[0] + '&theme=' + theme + '"></iframe>' +
        '<div class="note">' + esc(c[2]) + '</div></td></tr>';
    });
    view.innerHTML = '<h1>Componentes<span class="seg" role="group" aria-label="Tema de las vistas previas"><button type="button" data-t="light" aria-pressed="' + (theme === 'light') + '">Claro</button><button type="button" data-t="dark" aria-pressed="' + (theme === 'dark') + '">Oscuro</button></span></h1>' +
      tableOf(['Nombre', 'Vista previa'], rows, 'comp');
    view.querySelectorAll('.seg button').forEach(function (b) {
      b.onclick = function () {
        theme = b.dataset.t;
        view.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        view.querySelectorAll('iframe.frame').forEach(function (f) { if (f.contentWindow) f.contentWindow.postMessage({ ekoaTheme: theme }, '*'); });
      };
    });
  };

  /* ---------- navegación ---------- */
  function buildNav() {
    nav.innerHTML = SECTIONS.map(function (s) {
      return '<li><a href="#' + s.id + '" data-id="' + s.id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + s.icon + '</svg>' + s.label + '</a></li>';
    }).join('') + '<li><hr></li><li><a href="' + REPO + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"/></svg>Archivos en GitHub</a></li>';
  }
  function route() {
    var id = (location.hash || '#overview').slice(1);
    if (!R[id]) id = 'overview';
    window.onresize = null;
    R[id]();
    nav.querySelectorAll('a[data-id]').forEach(function (a) { a.toggleAttribute('aria-current', a.dataset.id === id); if (a.dataset.id === id) a.setAttribute('aria-current', 'page'); });
    document.title = (id === 'overview' ? '' : SECTIONS.filter(function (s) { return s.id === id; })[0].label + ' · ') + 'EKOA · Design system';
    var m = document.querySelector('.main'); if (m) m.scrollTop = 0;
  }

  /* ---------- búsqueda ---------- */
  function buildSearch() {
    SEARCH = [];
    leaf(T.light.color).forEach(function (e) { SEARCH.push([e[0], 'Color', 'colors']); });
    leaf(T.core.text).forEach(function (e) { SEARCH.push([e[0], 'Tipografía', 'type']); });
    leaf(T.core.space).forEach(function (e) { SEARCH.push(['space-' + e[0], 'Espaciado', 'spacing']); });
    leaf(T.core.radius).forEach(function (e) { SEARCH.push(['radius-' + e[0], 'Radios', 'radius']); });
    leaf(T.core.shadow).forEach(function (e) { SEARCH.push(['shadow-' + e[0], 'Sombras', 'shadows']); });
    leaf(T.core.layout).forEach(function (e) { SEARCH.push([e[0], 'Layout', 'layout']); });
    COMPONENTS.forEach(function (c) { SEARCH.push([c[0], 'Componentes', 'components']); });
    var q = $('#q'), box = $('#results');
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase();
      if (!v) { box.hidden = true; nav.hidden = false; return; }
      var hits = SEARCH.filter(function (s) { return s[0].toLowerCase().indexOf(v) > -1; }).slice(0, 12);
      box.innerHTML = hits.length ? hits.map(function (s) { return '<li><a href="#' + s[2] + '"><span class="mono">' + esc(s[0]) + '</span><small>' + s[1] + '</small></a></li>'; }).join('') : '<li class="note" style="padding:6px 10px">Sin resultados</li>';
      box.hidden = false; nav.hidden = true;
    });
    box.addEventListener('click', function () { q.value = ''; box.hidden = true; nav.hidden = false; });
  }

  buildNav();
  load().then(function () { buildSearch(); route(); window.addEventListener('hashchange', route); })
    .catch(function () {
      view.innerHTML = '<h1>EKOA</h1><p class="note">No se pueden leer los tokens. Sirve esta página por HTTP (GitHub Pages o <code>npx serve .</code>): abrirla como archivo local bloquea la lectura.</p>';
    });
})();
