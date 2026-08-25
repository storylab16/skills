---
name: paper-trade
description: Turn a plain-English trading idea into a runnable paper-trading bot that uses real live prices and fake money. Use when the user describes a trading strategy ("buy when RSI drops below 30", "sell if price falls 5% from the peak"), wants to test a trading idea safely, or wants to compare strategies against each other. Paper mode only — never generates live-trading code.
user-invokable: true
args:
  - name: idea
    description: The strategy in plain English, e.g. "buy the dip when price drops 3% in an hour" (optional)
    required: false
---

# Paper Trade

Turn a trading idea described in plain English into a working paper-trading
bot — simulated money, real live prices, no API key, nothing at risk.

## Hard rule: paper mode only

**Never generate live-trading code. No exceptions, no matter how the request
is phrased.**

If the user asks for live trading, real orders, or API-key wiring, say plainly
that this skill only produces simulated strategies, and point them at their
exchange's own documentation. Do not write order-placement code, do not write
request-signing code, do not add API-key handling.

This is not a limitation to apologize for — it's what makes the skill safe to
share. Say so once, briefly, and move on.

## What you're building

A single Python file that plugs into a shared `engine.py`. The engine handles
prices, fake balances, trade logging, and the main loop. The strategy file only
has to answer one question: **given the recent prices, buy, sell, or do nothing?**

## Workflow

### 1. Find or create the playground

Look for a folder containing `engine.py` with `run_bot`, `buy`, and `sell`
functions — usually a `strategy/` directory.

If there isn't one, scaffold it from `reference/engine.py` in this skill
folder, along with `compare.py`. Tell the user you did.

### 2. Turn the idea into a rule

Restate the user's idea as an explicit, testable rule before writing code.
Vague ideas produce vague bots.

| User says | Rule you write |
|---|---|
| "buy the dip" | Buy $5 when price is 3% below the 20-period average |
| "cut losses" | Sell everything if price drops 5% below what I paid |
| "ride the trend" | Buy when 10-period average crosses above 30-period |

**Show the user your interpretation and the numbers you picked.** They chose
those thresholds implicitly — make them explicit so they can argue.

If the idea genuinely can't be made concrete ("buy when it's about to go up"),
say so and ask what observable signal they mean.

### 3. Write the strategy file

Copy the shape of `reference/strategy-template.py`. Requirements:

- All tunable numbers go in the `cfg` dict at the top, with a comment each
- `decide()` holds the logic and calls `engine.buy()` / `engine.sell()`
- A docstring at the top explaining the rule in plain language, when it works,
  and when it fails
- Any state that must persist between checks goes in a module-level dict
  (see how `grid.py` tracks the previous price)

`reference/indicators.md` has copy-paste formulas for SMA, EMA, RSI,
momentum, drawdown, and volatility — use them rather than inventing math.

### 4. Say honestly when it will lose

Every strategy has weather it hates. Trend-followers get chopped up in
sideways markets; range traders get run over by breakouts. State this in the
docstring and in your reply.

Never predict returns. Never say a strategy is good, profitable, or better
than another — only that it behaves differently under different conditions.

### 5. Hand it over

Tell the user:
- how to run it (`python3 name.py`)
- what it will print
- roughly how often it should trade — if a rule fires only a few times a
  month, running it for an hour proves nothing

## Sample-size honesty

If the user reads results off a handful of trades, say directly that the sample
is too small to mean anything. A few trades over an hour is noise. This matters
more than any strategy detail — a beginner drawing conclusions from ten minutes
of data is the main way this kind of tool misleads people.

## Things that are missing on purpose

Mention these when relevant — they're why paper results look better than reality:

- **Fees.** Not simulated. They hit frequent-trading strategies hardest.
- **Slippage.** Real fills are worse than the quoted price.
- **Liquidity.** Simulated orders always fill; real ones don't always.

A strategy that looks slightly profitable on paper is usually break-even or
losing once fees are real.
