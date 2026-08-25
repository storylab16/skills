---
name: ascii-flow
description: Draw a vertical ASCII flowchart using box-drawing characters. Confluence-safe monospace style.
user-invokable: true
args:
  - name: flow
    description: What to draw — describe the flow, steps, or decisions (optional)
    required: false
---

Draw the requested flow as a vertical ASCII flowchart using the style defined in the style below.

## Style Rules

- **Nodes**: Rectangular boxes using `┌─┐` `└─┘` `│`
- **Arrows**: `│` vertical connector · `▼` downward step
- **Decisions**: `◇ Question?` diamond with `/` `\` branches and `YES` / `NO` labels
- **Merges**: `└───┬───┘` to rejoin two branches
- **Node width**: Consistent within a chart — pad shorter labels with spaces
- **Text**: Centered inside each box
- **Layout**: Vertical, top-to-bottom only
- **Wrap**: Always in a fenced triple-backtick code block (Confluence-safe)

## Node Types

```
┌─────────────────────────┐     Standard node
│       Step label        │
└─────────────────────────┘

┌─────────────────────────┐     Start / End node
│          Start          │
└─────────────────────────┘

        ◇ Decision?            Decision (no box)
       /           \
     YES            NO
      │              │
      ▼              ▼

└──────────┬──────────┘        Two paths merging
           │
           ▼

┌─────────────────────────┐
│   Step label            │  ← inline annotation
└─────────────────────────┘
```

## Two-column parallel entry

```
  Entry A                    Entry B
  ┌─────────────────────┐   ┌─────────────────────┐
  │       Step A        │   │       Step B        │
  └──────────┬──────────┘   └──────────┬──────────┘
             │                         │
             └────────────┬────────────┘
                          │
                          ▼
```

## Spacing Rules

- 1 blank line between each node + arrow group
- No blank lines inside a box
- All single-path boxes same width
- Left branch ~col 12, right branch ~col 36

## Output

Always wrap the entire chart in a fenced code block:

````
```
┌─────────────────┐
│   Your chart    │
└─────────────────┘
```
````

Draw the flow described in the `flow` argument (or ask the user what to draw if not provided).
