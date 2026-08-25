---
name: critique
description: Give a structured design critique of a screen, component, or flow — what's working, what isn't, and what to change first. Use when the user asks for design feedback, says a design "feels off" without knowing why, wants a review before shipping, or asks which of several options is stronger.
user-invokable: true
args:
  - name: target
    description: What to critique — a file, screenshot, URL, or description (optional)
    required: false
---

# Critique

Look at a design and say what's actually wrong with it, in an order the person
can act on.

## The failure this avoids

Most design feedback is a flat list of observations — "the spacing is
inconsistent, the CTA could be stronger, consider a different font." All true,
all equally weighted, none actionable. The person reads it and doesn't know
what to do Monday morning.

A good critique is **ordered by consequence**. One or two things matter most;
everything else is detail. Say which is which.

## Before you start

Ask what you can't infer, but ask *briefly* — one round, not an interview:

- **Who is this for?** Feedback for a first-time user differs completely from
  feedback for a daily power user.
- **What is the one job of this screen?** If nobody can answer this, that's the
  finding — you've found the real problem already.
- **How far along is it?** Wireframe critique is about structure. Pre-ship
  critique is about detail. Giving detail notes on a wireframe wastes
  everyone's time.

If the user just wants quick reactions, skip the questions and say what you see.

## How to look

Work in this order. It matters — structural problems make detail problems
irrelevant.

### 1. Squint first

Blur your eyes at it. What do you see first, second, third? Now compare that to
what *should* be first, second, third.

If the loudest element isn't the most important one, that's the headline
finding. It outranks everything else in this list.

### 2. One screen, one job

Can you say in one sentence what this screen is for? If it's doing two jobs,
that's usually the root cause of whatever else feels wrong — competing CTAs,
crowded layout, unclear hierarchy are all symptoms of it.

### 3. Hierarchy

Weight, size, color, and position should agree with each other about what's
important. When they disagree — a big heading in light gray next to a small
bold label — the design feels muddled without an obvious cause.

Check that emphasis is *relative*. If everything is bold, nothing is.

### 4. Alignment and grouping

Related things should be visibly related; unrelated things should be visibly
separate. Most "messy" designs are a grouping problem, not a spacing problem —
the gaps are inconsistent because the relationships were never decided.

Look for: items that align to nothing, groups with the same gap between them as
within them, edges that are *almost* aligned (worse than clearly not aligned).

### 5. Does color mean anything

Every color should be doing a job — status, action, or brand. Color used for
visual interest alone makes an interface harder to scan, because the user keeps
looking for a meaning that isn't there.

Check the reverse too: if red means error in one place and just decoration in
another, the user can't trust it anywhere.

### 6. Words

Copy is design. Look at labels, buttons, empty states, and errors.

- Do button labels say what happens? ("Save changes" not "Submit")
- Do errors say what to do next, not just what went wrong?
- Is there jargon the intended user wouldn't use themselves?
- Empty states: do they explain what goes here and how to start?

### 7. The states nobody designed

Ask what this looks like when: it's loading, it's empty, it failed, the text is
three times longer, there are 200 items instead of 3, the user has no
permission.

Missing states are the most common gap between a design that demos well and one
that survives contact with real use.

### 8. Detail, last

Optical alignment, consistent radii, icon weights, line height. Real, but only
worth raising once the structure holds. Flagging kerning on a screen with the
wrong information architecture is noise.

## How to write it up

**Lead with the one thing.** Open with the single change that would most improve
this design. One paragraph, no preamble.

**Then a short ordered list.** Three to six findings, most consequential first.
For each: what you observed, why it matters, and what to try. Skip the "why" if
it's obvious — don't pad.

**Say what's working, but only if it's true and specific.** "The empty state is
genuinely good — it explains the feature instead of apologizing for having no
data" is useful. "Nice clean look!" is filler and makes the rest less credible.

**Separate certain from uncertain.** If a call depends on context you don't
have, say so: "If this is for first-time users, the density is a problem. If
it's a daily tool, it's probably right."

## Rules

- **Critique the work, never the person.** "This hierarchy is unclear" — not
  "you didn't think about hierarchy."
- **Never invent a rule.** If there's no real reason behind a preference, say
  it's taste. "I'd personally go lighter here, but that's preference" is honest.
  Dressing taste up as principle is the most common way critique goes wrong.
- **Don't redesign it.** Point at the problem and suggest a direction. Handing
  over a full alternative takes the work away from the designer.
- **Three good findings beat twelve.** A long list is easy to write and hard to
  act on. Cut anything you wouldn't defend.
- **If it's good, say so and stop.** Manufacturing criticism to seem rigorous
  wastes the person's time and trains them to discount you.
