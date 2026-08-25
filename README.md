# Skills

Claude Code skills I built for my own work — design review, prototype
feedback, user research, and documentation.

Each folder is a self-contained skill: a `SKILL.md` telling Claude how to do
the thing, plus any assets it needs.

## What's here

| Skill | What it does |
|---|---|
| [`critique`](design/critique) | Structured design critique — ordered by consequence, so you know what to fix first instead of getting a flat list of observations. |
| [`prototype-comments`](prototyping/prototype-comments) | Drops a Figma-style comment layer into any browser prototype. Clickable pins, JSON export, no backend. |
| [`usability-test`](research/usability-test) | Plan and analyze user tests — writes unbiased tasks, catches leading questions, turns session notes into findings that hold up. |
| [`ascii-flow`](docs/ascii-flow) | Draws vertical ASCII flowcharts with box-drawing characters. Monospace-safe, pastes anywhere. |

## Installing

Copy any skill folder into `~/.claude/skills/`:

```bash
git clone https://github.com/storylab16/skills.git
cp -r skills/design/critique ~/.claude/skills/
```

Then use it in Claude Code:

```
/critique
```

Skills also work per-project — put them in `.claude/skills/` inside a repo and
they only load there.

## Why these exist

I'm a designer who got tired of explaining the same standards over and over.
A skill is a way to write down how you want something done once, and have it
applied consistently after that.

They're opinionated on purpose. `critique` refuses to pad a list with filler
findings. `usability-test` won't let you write "40% of users" from five people.
Those constraints are the useful part — a tool with no point of view just
agrees with you.

## License

MIT — use them, change them, ship them.
