---
name: prototype-comments
description: Add a Figma-style comment layer to any browser prototype — clickable pins, comment threads, localStorage persistence, and JSON export for sharing feedback. Use when someone wants comments, annotations, pins, or design-review markers inside a running prototype, static HTML export, or local dev app.
user-invokable: true
args:
  - name: target
    description: The prototype to add comments to — a file, folder, or dev server URL (optional)
    required: false
---

# Prototype Comments

Add a comment layer to a prototype so reviewers can pin feedback directly onto
the thing itself, instead of writing "the button on the third screen" in a
message thread.

No backend, no accounts, no build step. Comments live in the reviewer's
`localStorage` and are shared by exporting JSON.

## What the reviewer gets

- A floating bubble, bottom right. Click it, then click anywhere to drop a pin.
- Numbered pins that stay attached to the element they were dropped on, even
  when the layout reflows.
- A panel listing every comment on the current page — resolve, reopen, delete.
- Export to clipboard as JSON; import to merge someone else's comments in.
- Per-page tracking, so a multi-screen prototype keeps its comments separate.
- `Alt+C` toggles comment mode, `Esc` cancels, right-click the bubble opens
  the panel.

## Installing it

`assets/prototype-comments.js` is standalone and dependency-free. Copy it next
to the prototype and add two lines before `</body>`:

```html
<script src="prototype-comments.js"></script>
<script>
  PrototypeComments.init({ projectId: 'my-prototype' });
</script>
```

### Options

| Option | Default | What it does |
|---|---|---|
| `projectId` | `'prototype'` | Namespaces the storage. **Use a different one per prototype** or two prototypes on the same origin will share comments. |
| `author` | `''` | Name shown on each comment. Handy when several people review. |
| `zIndex` | very high | Raise only if the prototype has an even higher stacking context. |

### React / Vite / Next

Put the file in `public/`, then load it once on mount:

```jsx
useEffect(() => {
  if (window.PrototypeComments) return;          // already initialised
  const s = document.createElement('script');
  s.src = '/prototype-comments.js';
  s.onload = () => window.PrototypeComments.init({ projectId: 'my-app' });
  document.body.appendChild(s);
}, []);
```

Gate it so it never reaches production — `import.meta.env.DEV` in Vite, or
`process.env.NODE_ENV !== 'production'`.

### Client-side routing

Pins are recorded against `location.pathname + search + hash`. The layer
listens for `popstate` and `hashchange`. If the router does neither, call
`PrototypeComments.open()` after a route change, or re-init.

## API

```js
PrototypeComments.init(options)  // start it
PrototypeComments.open()         // open the panel
PrototypeComments.all()          // array of comment objects
PrototypeComments.clear()        // wipe comments for this projectId
```

## When adding this to a project

1. **Check it isn't already there** — look for `prototype-comments.js` before
   copying it in again.
2. **Copy the asset, don't rewrite it.** It's dependency-free on purpose.
3. **Pick a real `projectId`** — the prototype's name, not the default.
4. **Never ship it to production.** Say this to the user, and gate the include
   if the project has a dev/prod split.
5. **Tell them how to collect feedback**: each reviewer clicks Export, sends
   the JSON, and the owner clicks Import to merge. There is no server —
   comments do not sync on their own.

## Limits worth stating up front

- **Comments are per-browser.** Clearing site data loses them. Export before
  anything destructive.
- **Pins anchor to a CSS path.** If the DOM around the element changes
  substantially, a pin can lose its anchor — it's hidden rather than shown in
  the wrong place.
- **Elements inside an iframe or shadow DOM can't be pinned**, only the
  container.
- **Storage can fail** in private windows or with site data blocked. The layer
  keeps working in memory and warns in the console, but nothing persists.
