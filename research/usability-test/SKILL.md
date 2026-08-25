---
name: usability-test
description: Plan, run, and analyze usability tests — write unbiased tasks, spot leading questions, and turn messy session notes into findings that hold up. Use when the user is preparing a user test, reviewing a test plan or task wording, or has session notes to make sense of.
user-invokable: true
args:
  - name: task
    description: What you need — "write tasks for X", "check this for bias", "analyze these notes" (optional)
    required: false
---

# Usability Test

Help plan a test, check it for bias, or turn observations into findings.

Three modes — work out which one applies from what the user brings:

- **Plan** — they need tasks and a script
- **Check** — they have a plan and want the bias caught before they run it
- **Analyze** — they have notes and need findings

## Planning a test

### Start from a decision, not a topic

Ask what decision this test will inform. "We want feedback on the new flow"
isn't testable. "Should we keep the two-step confirmation or drop it?" is.

If nobody can name the decision, the test will produce interesting-sounding
notes that change nothing. Say that plainly and help them find the decision.

### Write tasks, not questions

A task is something the participant *does*. A question is something they
answer. Questions get you opinions; tasks get you behavior. Behavior is the
point.

| Not this | This |
|---|---|
| "What do you think of the search?" | "Find a red jacket under $80." |
| "Is the checkout easy?" | "Buy this item. Use the test card on the desk." |
| "Would you use this feature?" | "You want to stop getting these emails. Go ahead." |

### Task wording rules

**Never name the UI element.** "Tap the filter button" tests whether they can
follow instructions. "Narrow this down to just the size you wear" tests whether
they can find filtering at all — which is what you wanted to know.

**Give a goal and a reason, not a route.** Real motivation produces real
behavior. "You're meeting a friend in an hour and need something to wear" beats
"complete a purchase."

**Don't leak the expected answer.** Words like "easily," "simply," or "just"
tell the participant what should happen, so they blame themselves when it
doesn't.

**One task, one goal.** Compound tasks make it impossible to tell which part
failed.

**Say what "done" is** — for you, not out loud to them. You need a clear
success criterion or you'll argue about it afterward.

### How many people

Five participants per distinct user group finds most of the obvious problems.
More than that has diminishing returns until you change something and retest.

But five is only enough **per group**. If newcomers and experts use the product
differently, five mixed people tell you little about either.

## Checking a plan for bias

Read the script and flag these — they're the common ones, in rough order of how
often they appear:

| Problem | Looks like | Fix |
|---|---|---|
| Leading | "How easy was it to…" | "What was that like?" |
| Naming the element | "Click Settings, then…" | Give the goal only |
| Compound task | "Sign up and then invite a friend" | Split them |
| Closed question | "Did that make sense?" | "What did you expect to happen?" |
| Rescuing too early | Helping at the first pause | Wait. Silence is data. |
| Asking for prediction | "Would you use this?" | People are bad at this. Ask what they do now instead. |

Also check the **order**. An early task can teach the participant something that
makes a later task artificially easy. If task 3 reveals where a feature lives,
task 5 can no longer test whether it's findable.

## Running it

Things worth telling the user before they facilitate:

- **Say you're testing the product, not them.** Say it once at the start and
  mean it — it changes how much people admit to being confused.
- **Ask them to think aloud**, and remind them when they go quiet — once, gently.
- **Count silently to ten before helping.** Most people solve it in second seven.
  What they do while stuck is the most valuable thing you'll see all session.
- **Never explain how it works**, even when they're wrong, until the task is
  over. The moment you explain, that participant is spent for that task.
- **"What did you expect to happen?"** is the highest-value question in testing.
  Use it whenever they look surprised.
- **Watch what they do, not what they say.** When behavior and commentary
  disagree, believe the behavior.

## Analyzing notes

### Separate what happened from what it means

Write observations first, plainly: "4 of 5 scrolled past the button." Only then
interpret: "the button doesn't read as interactive." Keeping these apart is what
makes findings arguable in a good way — people can challenge the interpretation
without disputing the facts.

### Group by cause, not by screen

Five issues that all stem from one unclear label are one finding, not five.
Merging them tells the team what to fix; listing them separately makes a small
problem look like five.

### Rank by frequency and severity

Something that blocked one person completely may matter more than something that
mildly annoyed everyone. Say which kind each finding is — a blocker, a slowdown,
or a papercut.

### Say how confident you are

Be explicit about sample size in the finding itself: "1 of 5" reads very
differently from "5 of 5." Don't write "users struggled" when one person did.

Never write a percentage from five people. "40% of users" from a sample of five
is two people, and stating it that way misleads whoever reads the summary later.

### Note what you couldn't test

If the session ran out of time, or a participant had prior knowledge, or the
prototype couldn't do something — write it down. The gaps are as useful as the
findings, and they stop someone concluding more than the test supports.

## Rules

- **Don't confirm.** A test that sets out to prove the design works isn't a
  test. If you notice the plan is shaped to succeed, say so.
- **Recruit the actual users.** Colleagues already know the product and the
  vocabulary. They can't tell you what a newcomer sees, and testing on them
  systematically hides the worst problems.
- **The team watching is part of the method.** One person seeing a real user
  fail changes more minds than any report. Push for observers.
- **Report what happened, including the boring result.** "No one had trouble"
  is a real finding worth stating clearly.
