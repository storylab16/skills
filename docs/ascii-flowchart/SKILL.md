---
name: ascii-flowchart
description: Draw a flowchart using box-drawing characters, so it renders anywhere monospace text does — markdown, code comments, terminals, wikis, commit messages. Use when someone wants a flow, process, decision tree, or state diagram as plain text rather than an image.
user-invokable: true
args:
  - name: flow
    description: What to draw — the steps, decisions, or process (optional)
    required: false
---

# ASCII Flowchart

Draw a process as plain text using box-drawing characters.

## Why plain text

An image of a diagram goes stale the moment the process changes, and nobody
updates it because that means opening a design tool. A text diagram lives in
the file it describes, diffs in version control, and anyone can fix a box
without leaving the editor.

Use this when the diagram belongs *next to* the thing it explains — a README,
a code comment, a design doc, a pull request.

Don't use it for anything with more than about eight nodes, heavy branching, or
where layout carries meaning. Past that, plain text gets harder to read than
the process it describes. Say so and suggest a real diagram instead.

## Style

- **Nodes**: boxes from `┌ ─ ┐ │ └ ┘`
- **Flow**: `│` to connect, `▼` to point
- **Decisions**: `◇ Question?` with `/` and `\` branches, labelled `YES` / `NO`
- **Merges**: `└───┬───┘` to rejoin
- **Direction**: vertical, top to bottom, always
- **Width**: every box in a chart the same width — pad shorter labels
- **Text**: centred in the box
- **Output**: always inside a fenced code block

## Parts

```
┌─────────────────────────┐     Step
│       Step label        │
└─────────────────────────┘

        ◇ Decision?              Decision — no box around it
       /           \
     YES            NO
      │              │
      ▼              ▼

└──────────┬──────────┘         Branches rejoining
           │
           ▼
```

Two flows starting side by side:

```
  Entry A                      Entry B
  ┌─────────────────────┐     ┌─────────────────────┐
  │       Step A        │     │       Step B        │
  └──────────┬──────────┘     └──────────┬──────────┘
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
```

## Worked example

"User submits a form. If the email is already taken, show an error, otherwise
create the account and send a welcome email."

```
┌─────────────────────────┐
│      Submit form        │
└────────────┬────────────┘
             │
             ▼
        ◇ Email taken?
       /              \
     YES               NO
      │                 │
      ▼                 ▼
┌───────────────┐  ┌───────────────┐
│  Show error   │  │ Create account│
└───────┬───────┘  └───────┬───────┘
        │                  │
        │                  ▼
        │          ┌───────────────┐
        │          │ Send welcome  │
        │          └───────┬───────┘
        │                  │
        └────────┬─────────┘
                 │
                 ▼
           ┌───────────┐
           │   Done    │
           └───────────┘
```

## Spacing

- One blank line between a node and the next arrow group
- Never a blank line inside a box
- Left branch around column 12, right branch around column 36
- Keep the whole chart under 80 characters wide — wider and it wraps in
  narrow panes, which destroys the alignment

## Mistakes that make these unreadable

**Boxes of different widths on the same path.** The eye reads varying width as
meaning. Pad them all to match.

**Branch arms that don't line up.** If `YES` and `NO` sit at different depths,
the chart looks broken even when the logic is right. Count the characters.

**Proportional font.** These only work in monospace. Always wrap in a fenced
code block, even in a chat message.

**Too much text in a box.** A node is a label, not a sentence. Long text forces
every box wider. Put detail in prose under the chart.

**Diagonal or sideways flow.** Vertical only. Horizontal layouts need
alignment maths that break the moment anyone edits them.

## Output

Wrap the finished chart in a fenced code block so it renders as monospace:

````
```
┌─────────────────┐
│   Your chart    │
└─────────────────┘
```
````

If the `flow` argument is missing, ask what to draw before drawing.
