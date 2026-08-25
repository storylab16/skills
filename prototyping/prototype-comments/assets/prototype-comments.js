/**
 * prototype-comments — a lightweight Figma-style comment layer for any
 * browser prototype. No dependencies, no backend, no build step.
 *
 * Comments are stored in localStorage and can be exported/imported as JSON.
 *
 * Usage:
 *   <script src="prototype-comments.js"></script>
 *   <script>PrototypeComments.init({ projectId: 'my-prototype' });</script>
 */
(function (global) {
  'use strict';

  var cfg = { projectId: 'prototype', author: '', zIndex: 2147483000 };
  var comments = [];
  var placing = false;
  var root, layer, panel, fab;

  // --- storage -------------------------------------------------------

  function key() { return 'prototype-comments:' + cfg.projectId; }

  function load() {
    try {
      comments = JSON.parse(localStorage.getItem(key())) || [];
    } catch (e) {
      comments = [];  // private mode, cleared data, or corrupt JSON
    }
  }

  function save() {
    try {
      localStorage.setItem(key(), JSON.stringify(comments));
    } catch (e) {
      // Storage can be unavailable or full — keep working in memory.
      console.warn('[prototype-comments] could not save:', e.message);
    }
  }

  // --- anchoring -----------------------------------------------------
  // A pin remembers which element it was dropped on plus a percentage
  // offset inside it, so it stays put when the layout reflows.

  function selectorFor(el) {
    if (!el || el === document.body) return 'body';
    if (el.id) return '#' + CSS.escape(el.id);
    var parts = [];
    while (el && el !== document.body && parts.length < 5) {
      var part = el.tagName.toLowerCase();
      var parent = el.parentElement;
      if (parent) {
        var same = Array.prototype.filter.call(
          parent.children, function (c) { return c.tagName === el.tagName; });
        if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(el) + 1) + ')';
      }
      parts.unshift(part);
      el = parent;
    }
    return parts.join(' > ') || 'body';
  }

  function resolve(c) {
    var el;
    try { el = document.querySelector(c.selector); } catch (e) { el = null; }
    if (!el) return null;
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    return { x: r.left + window.scrollX + r.width * c.xPct,
             y: r.top + window.scrollY + r.height * c.yPct };
  }

  function currentPage() {
    return location.pathname + location.search + location.hash;
  }

  // --- rendering -----------------------------------------------------

  function render() {
    layer.innerHTML = '';
    var page = currentPage();
    var visible = comments.filter(function (c) { return c.page === page; });

    visible.forEach(function (c, i) {
      var pos = resolve(c);
      if (!pos) return;  // anchor element is gone or hidden
      var pin = document.createElement('button');
      pin.className = 'pc-pin' + (c.resolved ? ' pc-done' : '');
      pin.textContent = i + 1;
      pin.style.left = pos.x + 'px';
      pin.style.top = pos.y + 'px';
      pin.title = c.text;
      pin.onclick = function (e) { e.stopPropagation(); openPanel(c.id); };
      layer.appendChild(pin);
    });

    if (fab) {
      var open = visible.filter(function (c) { return !c.resolved; }).length;
      fab.textContent = placing ? '×' : (open ? '💬 ' + open : '💬');
    }
  }

  // --- comment creation ----------------------------------------------

  function onPlaceClick(e) {
    if (!placing) return;
    if (e.target.closest('.pc-ui')) return;   // ignore our own chrome
    e.preventDefault();
    e.stopPropagation();

    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || el.closest('.pc-ui')) return;
    var r = el.getBoundingClientRect();

    var draft = {
      id: 'c' + Date.now().toString(36),
      page: currentPage(),
      selector: selectorFor(el),
      xPct: r.width ? (e.clientX - r.left) / r.width : 0.5,
      yPct: r.height ? (e.clientY - r.top) / r.height : 0.5,
      text: '', author: cfg.author, resolved: false,
      created: new Date().toISOString()
    };

    setPlacing(false);
    openComposer(draft, e.clientX, e.clientY);
  }

  function openComposer(draft, x, y) {
    var box = document.createElement('div');
    box.className = 'pc-ui pc-composer';
    box.style.left = Math.min(x, window.innerWidth - 280) + 'px';
    box.style.top = Math.min(y, window.innerHeight - 160) + 'px';
    box.innerHTML =
      '<textarea class="pc-input" rows="3" placeholder="What about this?"></textarea>' +
      '<div class="pc-row"><button class="pc-btn pc-ghost">Cancel</button>' +
      '<button class="pc-btn pc-primary">Comment</button></div>';
    root.appendChild(box);

    var input = box.querySelector('textarea');
    input.focus();

    function close() { box.remove(); }
    box.querySelector('.pc-ghost').onclick = close;
    box.querySelector('.pc-primary').onclick = function () {
      var text = input.value.trim();
      if (!text) return close();
      draft.text = text;
      comments.push(draft);
      save();
      close();
      render();
    };
    input.onkeydown = function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        box.querySelector('.pc-primary').click();
      }
    };
  }

  // --- panel ---------------------------------------------------------

  function openPanel(focusId) {
    closePanel();
    panel = document.createElement('div');
    panel.className = 'pc-ui pc-panel';

    var page = currentPage();
    var list = comments.filter(function (c) { return c.page === page; });

    var html = '<div class="pc-head"><strong>Comments</strong>' +
      '<span class="pc-actions">' +
      '<button class="pc-link" data-act="export">Export</button>' +
      '<button class="pc-link" data-act="import">Import</button>' +
      '<button class="pc-link" data-act="close">Close</button></span></div>';

    if (!list.length) {
      html += '<p class="pc-empty">No comments on this page yet. ' +
              'Hit the bubble, then click anything to leave one.</p>';
    }

    list.forEach(function (c, i) {
      html += '<div class="pc-item' + (c.id === focusId ? ' pc-focus' : '') +
        (c.resolved ? ' pc-done' : '') + '" data-id="' + c.id + '">' +
        '<div class="pc-num">' + (i + 1) + '</div><div class="pc-body">' +
        '<div class="pc-text"></div>' +
        '<div class="pc-meta">' + (c.author ? c.author + ' · ' : '') +
        new Date(c.created).toLocaleString() + '</div>' +
        '<div class="pc-row"><button class="pc-link" data-act="toggle">' +
        (c.resolved ? 'Reopen' : 'Resolve') + '</button>' +
        '<button class="pc-link" data-act="delete">Delete</button></div>' +
        '</div></div>';
    });

    panel.innerHTML = html;
    // Insert comment text as textContent so prototype content can't inject markup
    list.forEach(function (c) {
      var node = panel.querySelector('[data-id="' + c.id + '"] .pc-text');
      if (node) node.textContent = c.text;
    });
    root.appendChild(panel);

    panel.onclick = function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.dataset.act;
      var holder = btn.closest('[data-id]');
      var id = holder && holder.dataset.id;

      if (act === 'close') return closePanel();
      if (act === 'export') return exportJSON();
      if (act === 'import') return importJSON();

      var c = comments.find(function (x) { return x.id === id; });
      if (!c) return;
      if (act === 'toggle') c.resolved = !c.resolved;
      if (act === 'delete') comments = comments.filter(function (x) { return x.id !== id; });
      save();
      render();
      openPanel();
    };
  }

  function closePanel() { if (panel) { panel.remove(); panel = null; } }

  // --- import / export -----------------------------------------------

  function exportJSON() {
    var data = JSON.stringify(
      { projectId: cfg.projectId, exported: new Date().toISOString(), comments: comments },
      null, 2);
    // Copy to clipboard rather than download — sandboxed viewers block downloads.
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data).then(function () {
        alertish('Copied ' + comments.length + ' comments to clipboard');
      }, function () { showRaw(data); });
    } else {
      showRaw(data);
    }
  }

  function showRaw(data) {
    var box = document.createElement('div');
    box.className = 'pc-ui pc-panel';
    box.innerHTML = '<div class="pc-head"><strong>Copy this</strong>' +
      '<button class="pc-link" data-close>Close</button></div>' +
      '<textarea class="pc-input" rows="12"></textarea>';
    box.querySelector('textarea').value = data;
    box.querySelector('[data-close]').onclick = function () { box.remove(); };
    root.appendChild(box);
    box.querySelector('textarea').select();
  }

  function importJSON() {
    var box = document.createElement('div');
    box.className = 'pc-ui pc-panel';
    box.innerHTML = '<div class="pc-head"><strong>Paste exported JSON</strong>' +
      '<button class="pc-link" data-close>Close</button></div>' +
      '<textarea class="pc-input" rows="10" placeholder="Paste here"></textarea>' +
      '<div class="pc-row"><button class="pc-btn pc-primary">Merge in</button></div>';
    root.appendChild(box);
    box.querySelector('[data-close]').onclick = function () { box.remove(); };
    box.querySelector('.pc-primary').onclick = function () {
      try {
        var parsed = JSON.parse(box.querySelector('textarea').value);
        var incoming = parsed.comments || parsed;
        if (!Array.isArray(incoming)) throw new Error('expected a list of comments');
        var seen = {};
        comments.forEach(function (c) { seen[c.id] = true; });
        incoming.forEach(function (c) { if (c && c.id && !seen[c.id]) comments.push(c); });
        save();
        box.remove();
        render();
        openPanel();
      } catch (err) {
        alertish('Could not read that: ' + err.message);
      }
    };
  }

  function alertish(msg) {
    var t = document.createElement('div');
    t.className = 'pc-ui pc-toast';
    t.textContent = msg;
    root.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  // --- chrome --------------------------------------------------------

  function setPlacing(on) {
    placing = on;
    document.body.style.cursor = on ? 'crosshair' : '';
    render();
  }

  var CSS_TEXT =
    '.pc-layer{position:absolute;inset:0;pointer-events:none;z-index:__Z__}' +
    '.pc-pin{position:absolute;pointer-events:auto;transform:translate(-50%,-100%);' +
    'width:26px;height:26px;border-radius:50% 50% 50% 2px;border:2px solid #fff;' +
    'background:#2563eb;color:#fff;font:600 12px/1 system-ui,sans-serif;cursor:pointer;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.25)}' +
    '.pc-pin.pc-done{background:#16a34a;opacity:.65}' +
    '.pc-fab{position:fixed;right:20px;bottom:20px;z-index:__Z2__;min-width:48px;height:48px;' +
    'padding:0 14px;border-radius:24px;border:none;background:#111827;color:#fff;' +
    'font:600 15px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.3)}' +
    '.pc-panel{position:fixed;right:20px;bottom:80px;z-index:__Z2__;width:320px;' +
    'max-height:70vh;overflow:auto;background:#fff;color:#111827;border-radius:12px;' +
    'box-shadow:0 12px 40px rgba(0,0,0,.22);padding:14px;font:14px/1.5 system-ui,sans-serif}' +
    '.pc-composer{position:fixed;z-index:__Z2__;width:260px;background:#fff;border-radius:10px;' +
    'box-shadow:0 12px 40px rgba(0,0,0,.22);padding:10px;font:14px/1.5 system-ui,sans-serif}' +
    '.pc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}' +
    '.pc-actions{display:flex;gap:8px}' +
    '.pc-item{display:flex;gap:10px;padding:10px 0;border-top:1px solid #eef0f3}' +
    '.pc-item.pc-focus{background:#f5f8ff;margin:0 -8px;padding:10px 8px;border-radius:8px}' +
    '.pc-item.pc-done .pc-text{text-decoration:line-through;opacity:.55}' +
    '.pc-num{flex:none;width:22px;height:22px;border-radius:50%;background:#2563eb;color:#fff;' +
    'font:600 11px/22px system-ui,sans-serif;text-align:center}' +
    '.pc-item.pc-done .pc-num{background:#16a34a}' +
    '.pc-body{flex:1;min-width:0}.pc-text{white-space:pre-wrap;word-break:break-word}' +
    '.pc-meta{color:#6b7280;font-size:11px;margin-top:3px}' +
    '.pc-row{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}' +
    '.pc-input{width:100%;box-sizing:border-box;border:1px solid #d1d5db;border-radius:8px;' +
    'padding:8px;font:14px/1.5 system-ui,sans-serif;resize:vertical}' +
    '.pc-btn{border:none;border-radius:7px;padding:7px 13px;font:600 13px system-ui,sans-serif;cursor:pointer}' +
    '.pc-primary{background:#2563eb;color:#fff}.pc-ghost{background:#f3f4f6;color:#374151}' +
    '.pc-link{background:none;border:none;color:#2563eb;font:13px system-ui,sans-serif;cursor:pointer;padding:2px}' +
    '.pc-empty{color:#6b7280;margin:0}' +
    '.pc-toast{position:fixed;left:50%;bottom:80px;transform:translateX(-50%);z-index:__Z2__;' +
    'background:#111827;color:#fff;padding:10px 16px;border-radius:8px;font:14px system-ui,sans-serif}';

  function mount() {
    root = document.createElement('div');
    root.className = 'pc-root';
    document.body.appendChild(root);

    var style = document.createElement('style');
    style.textContent = CSS_TEXT
      .split('__Z__').join(cfg.zIndex)
      .split('__Z2__').join(cfg.zIndex + 1);
    document.head.appendChild(style);

    layer = document.createElement('div');
    layer.className = 'pc-layer pc-ui';
    root.appendChild(layer);

    fab = document.createElement('button');
    fab.className = 'pc-fab pc-ui';
    fab.onclick = function () {
      if (placing) return setPlacing(false);
      if (panel) { closePanel(); return setPlacing(true); }
      setPlacing(true);
    };
    fab.oncontextmenu = function (e) { e.preventDefault(); openPanel(); };
    root.appendChild(fab);

    document.addEventListener('click', onPlaceClick, true);
    window.addEventListener('resize', render);
    window.addEventListener('scroll', render, true);
    window.addEventListener('hashchange', render);
    window.addEventListener('popstate', render);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && placing) setPlacing(false);
      if (e.key === 'c' && e.altKey) setPlacing(!placing);
    });
  }

  global.PrototypeComments = {
    init: function (options) {
      Object.assign(cfg, options || {});
      load();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { mount(); render(); });
      } else {
        mount(); render();
      }
    },
    open: openPanel,
    all: function () { return comments.slice(); },
    clear: function () { comments = []; save(); render(); }
  };
})(window);
