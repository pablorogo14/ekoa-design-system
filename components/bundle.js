/* @ds-bundle: {"format":4,"namespace":"EKOA","components":[{"name":"Icon"},{"name":"Button"},{"name":"Chip"},{"name":"Badge"},{"name":"SegmentedControl"},{"name":"Switch"},{"name":"TextField"},{"name":"GroupedList"},{"name":"ListRow"},{"name":"NavigationBar"},{"name":"TabBar"},{"name":"Sheet"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function without(props, keys) {
    var o = {};
    for (var k in props) if (Object.prototype.hasOwnProperty.call(props, k) && keys.indexOf(k) === -1) o[k] = props[k];
    return o;
  }

  /* ---------- Icon: SF Symbols-style line icons, 24 pt grid ---------- */
  var ICONS = {
    compass: function (f) {
      return [h('circle', { key: 1, cx: 12, cy: 12, r: 9 }), h('path', { key: 2, d: 'M15 9l-2.1 5.1L8 16l2.1-5.1L15 9z', fill: f ? 'currentColor' : 'none', stroke: f ? 'none' : 'currentColor' })];
    },
    search: function () {
      return [h('circle', { key: 1, cx: 10.5, cy: 10.5, r: 6.3 }), h('line', { key: 2, x1: 15.3, y1: 15.3, x2: 20, y2: 20 })];
    },
    pin: function (f) {
      return [
        h('path', { key: 1, d: 'M12 21s7-7.2 7-12.2A7 7 0 1 0 5 8.8C5 13.8 12 21 12 21z', fill: f ? 'currentColor' : 'none', stroke: f ? 'none' : 'currentColor' }),
        h('circle', { key: 2, cx: 12, cy: 8.8, r: 2.6, fill: f ? 'var(--card)' : 'none', stroke: f ? 'none' : 'currentColor' })
      ];
    },
    person: function (f) {
      return [
        h('circle', { key: 1, cx: 12, cy: 8, r: 4, fill: f ? 'currentColor' : 'none' }),
        h('path', { key: 2, d: 'M4.5 20c0-4.4 3.6-7 7.5-7s7.5 2.6 7.5 7', fill: f ? 'currentColor' : 'none', stroke: f ? 'none' : 'currentColor' })
      ];
    },
    chevronLeft: function () { return [h('path', { key: 1, d: 'M16 4l-8 8 8 8' })]; },
    chevronRight: function () { return [h('path', { key: 1, d: 'M8 4l8 8-8 8' })]; },
    more: function () {
      return [h('circle', { key: 1, cx: 5, cy: 12, r: 1.9, fill: 'currentColor', stroke: 'none' }), h('circle', { key: 2, cx: 12, cy: 12, r: 1.9, fill: 'currentColor', stroke: 'none' }), h('circle', { key: 3, cx: 19, cy: 12, r: 1.9, fill: 'currentColor', stroke: 'none' })];
    },
    up: function () { return [h('path', { key: 1, d: 'M12 19V6' }), h('path', { key: 2, d: 'M6 11l6-6 6 6' })]; },
    trash: function () { return [h('path', { key: 1, d: 'M4 7h16' }), h('path', { key: 2, d: 'M9 7V4h6v3' }), h('path', { key: 3, d: 'M6 7l1 13h10l1-13' })]; },
    pencil: function () { return [h('path', { key: 1, d: 'M12 20h9' }), h('path', { key: 2, d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' })]; }
  };
  var HEAVY = { chevronLeft: 1, chevronRight: 1, up: 1 };

  function Icon(p) {
    var draw = ICONS[p.name];
    if (!draw) return null;
    var size = p.size || 24;
    return h('svg', {
      className: cx('ek-icon', p.className),
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: HEAVY[p.name] ? 2.2 : 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      focusable: 'false',
      'aria-hidden': p.title ? undefined : 'true',
      role: p.title ? 'img' : undefined,
      'aria-label': p.title
    }, draw(!!p.filled));
  }

  /* ---------- Button ---------- */
  function Button(p) {
    var variant = p.variant || 'primary';
    var size = p.size || 'md';
    var o = without(p, ['variant', 'size', 'block', 'loading', 'icon', 'className', 'children']);
    o.className = cx('ek-btn', 'ek-btn-' + variant, 'ek-btn-' + size, p.block && 'ek-btn-block', p.className);
    if (!o.type) o.type = 'button';
    if (p.loading) { o.disabled = true; o['aria-busy'] = 'true'; }
    return h('button', o, p.icon || null, p.children);
  }

  /* ---------- Chip ---------- */
  function Chip(p) {
    var o = without(p, ['selected', 'tone', 'className', 'children']);
    o.className = cx('ek-chip', p.tone === 'tinted' && 'ek-chip-tinted', p.selected && 'ek-chip-selected', p.className);
    o.type = 'button';
    if (p.selected !== undefined) o['aria-pressed'] = p.selected ? 'true' : 'false';
    return h('button', o, p.children);
  }

  /* ---------- Badge ---------- */
  function Badge(p) {
    return h('span', { className: cx('ek-badge', 'ek-badge-' + (p.tone || 'neutral'), p.className) }, p.children);
  }

  /* ---------- SegmentedControl ---------- */
  function SegmentedControl(p) {
    var opts = p.options || [];
    var st = React.useState(p.defaultValue !== undefined ? p.defaultValue : (opts[0] && opts[0].value));
    var value = p.value !== undefined ? p.value : st[0];
    return h('div', { className: cx('ek-seg', p.className), role: 'group', 'aria-label': p['aria-label'] },
      opts.map(function (opt) {
        var on = opt.value === value;
        return h('button', {
          key: opt.value,
          type: 'button',
          className: cx('ek-seg-item', on && 'ek-seg-on'),
          'aria-pressed': on ? 'true' : 'false',
          onClick: function () { st[1](opt.value); if (p.onChange) p.onChange(opt.value); }
        }, opt.label);
      })
    );
  }

  /* ---------- Switch ---------- */
  function Switch(p) {
    var st = React.useState(!!p.defaultChecked);
    var on = p.checked !== undefined ? !!p.checked : st[0];
    return h('button', {
      type: 'button',
      role: 'switch',
      'aria-checked': on ? 'true' : 'false',
      'aria-label': p['aria-label'],
      disabled: p.disabled,
      className: cx('ek-switch', on && 'ek-switch-on', p.className),
      onClick: function () { st[1](!on); if (p.onChange) p.onChange(!on); }
    }, h('span', { className: 'ek-switch-knob' }));
  }

  /* ---------- TextField ---------- */
  function TextField(p) {
    var auto = React.useId();
    var id = p.id || auto;
    var msgId = id + '-msg';
    var o = without(p, ['label', 'hint', 'error', 'id', 'className']);
    o.id = id;
    o.className = cx('ek-input', p.error && 'ek-input-error');
    if (p.error) o['aria-invalid'] = 'true';
    if (p.error || p.hint) o['aria-describedby'] = msgId;
    return h('div', { className: cx('ek-field', p.className) },
      p.label ? h('label', { className: 'ek-field-label', htmlFor: id }, p.label) : null,
      h('input', o),
      p.error ? h('p', { className: 'ek-field-msg ek-field-error', id: msgId }, p.error)
        : (p.hint ? h('p', { className: 'ek-field-msg', id: msgId }, p.hint) : null)
    );
  }

  /* ---------- GroupedList + ListRow ---------- */
  function GroupedList(p) {
    return h('section', { className: cx('ek-group-wrap', p.className) },
      p.header ? h('h2', { className: 'ek-group-header' }, p.header) : null,
      h('div', { className: 'ek-group', role: 'list' }, p.children),
      p.footer ? h('p', { className: 'ek-group-footer' }, p.footer) : null
    );
  }

  function ListRow(p) {
    var clickable = !!p.onClick;
    var Tag = clickable ? 'button' : 'div';
    var showChevron = p.chevron !== undefined ? p.chevron : clickable;
    var lead = null;
    if (p.icon) lead = h('span', { className: 'ek-row-lead' }, typeof p.icon === 'string' ? h(Icon, { name: p.icon, size: 20 }) : p.icon);
    var props = {
      className: cx('ek-row', lead && 'ek-row-has-lead', p.className),
      role: 'listitem'
    };
    if (clickable) { props.type = 'button'; props.onClick = p.onClick; }
    return h(Tag, props,
      lead,
      h('span', { className: 'ek-row-main' },
        h('span', { className: 'ek-row-title' }, p.title),
        p.subtitle ? h('span', { className: 'ek-row-sub' }, p.subtitle) : null
      ),
      p.trailing ? h('span', { className: 'ek-row-trailing' }, p.trailing) : null,
      showChevron ? h(Icon, { name: 'chevronRight', size: 14, className: 'ek-row-chevron' }) : null
    );
  }

  /* ---------- NavigationBar ---------- */
  function NavigationBar(p) {
    var back = null;
    if (p.back) {
      back = h('button', { type: 'button', className: 'ek-nav-back', onClick: p.onBack },
        h(Icon, { name: 'chevronLeft', size: 20 }),
        typeof p.back === 'string' ? h('span', null, p.back) : null
      );
    }
    return h('header', { className: cx('ek-nav', p.large && 'ek-nav-large-mode', p.className) },
      h('div', { className: 'ek-nav-bar' },
        h('div', { className: 'ek-nav-side' }, back),
        h('div', { className: 'ek-nav-title' }, p.large ? null : p.title),
        h('div', { className: 'ek-nav-side ek-nav-side-end' }, p.trailing || null)
      ),
      p.large ? h('h1', { className: 'ek-nav-large' }, p.title) : null
    );
  }

  /* ---------- TabBar ---------- */
  function TabBar(p) {
    var items = p.items || [];
    return h('nav', { className: cx('ek-tabbar', p.className), 'aria-label': p['aria-label'] || 'Principal' },
      items.map(function (it) {
        var on = it.id === p.value;
        return h('button', {
          key: it.id,
          type: 'button',
          className: cx('ek-tab', on && 'ek-tab-on'),
          'aria-current': on ? 'page' : undefined,
          onClick: function () { if (p.onChange) p.onChange(it.id); }
        }, h(Icon, { name: it.icon, size: 24, filled: on }), h('span', null, it.label));
      })
    );
  }

  /* ---------- Sheet ---------- */
  function Sheet(p) {
    return h('div', { className: cx('ek-scrim', p.className), onClick: p.onClose },
      h('div', { className: 'ek-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': p.title, onClick: function (e) { e.stopPropagation(); } },
        h('div', { className: 'ek-grabber', 'aria-hidden': 'true' }),
        h('div', { className: 'ek-sheet-head' },
          h('h2', { className: 'ek-sheet-title' }, p.title),
          h('button', { type: 'button', className: 'ek-btn ek-btn-text ek-btn-sm', onClick: p.onClose }, p.closeLabel || 'Cerrar')
        ),
        h('div', { className: 'ek-sheet-body' }, p.children)
      )
    );
  }

  var api = {
    Icon: Icon, Button: Button, Chip: Chip, Badge: Badge, SegmentedControl: SegmentedControl,
    Switch: Switch, TextField: TextField, GroupedList: GroupedList, ListRow: ListRow,
    NavigationBar: NavigationBar, TabBar: TabBar, Sheet: Sheet
  };
  window.EKOA = window.EKOA || {};
  for (var k in api) window.EKOA[k] = api[k];
})();
