# Indicator formulas

Copy-paste helpers for `decide()`. All take `prices` — a list of closing
prices, oldest first. Use these instead of inventing math.

## SMA — simple moving average

The plain average of the last N prices. The baseline trend measure.

```python
def sma(prices, n):
    if len(prices) < n:
        return None
    return sum(prices[-n:]) / n
```

**Crossover:** compare a short SMA to a long one. Short above long = recent
prices running hotter than the longer trend.

```python
short, long = sma(prices, 10), sma(prices, 30)
if short and long and short > long:
    ...  # uptrend
```

To detect the *moment* of a cross (not just the state), you need the previous
values too — compute both SMAs excluding the last price:

```python
prev_short, prev_long = sma(prices[:-1], 10), sma(prices[:-1], 30)
crossed_up = prev_short <= prev_long and short > long
```

## EMA — exponential moving average

Like SMA but weights recent prices more heavily, so it reacts faster.

```python
def ema(prices, n):
    if len(prices) < n:
        return None
    k = 2 / (n + 1)
    value = sum(prices[:n]) / n          # seed with an SMA
    for p in prices[n:]:
        value = p * k + value * (1 - k)
    return value
```

## RSI — relative strength index

Momentum on a 0–100 scale. Below 30 is conventionally "oversold", above 70
"overbought". Standard period is 14.

```python
def rsi(prices, n=14):
    if len(prices) < n + 1:
        return None
    gains, losses = [], []
    for i in range(-n, 0):
        change = prices[i] - prices[i - 1]
        gains.append(max(change, 0))
        losses.append(max(-change, 0))
    avg_gain = sum(gains) / n
    avg_loss = sum(losses) / n
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))
```

**Note:** "oversold" does not mean "about to go up." In a downtrend RSI can sit
below 30 for a long time while price keeps falling. Say this to the user if
they build an RSI-only strategy.

## Momentum — percent change over N periods

```python
def momentum_pct(prices, n):
    if len(prices) < n + 1:
        return None
    return (prices[-1] - prices[-n - 1]) / prices[-n - 1] * 100
```

## Drawdown — how far below the recent peak

Useful for stop-losses and "buy the dip" rules.

```python
def drawdown_pct(prices, n=60):
    window = prices[-n:]
    peak = max(window)
    return (peak - prices[-1]) / peak * 100
```

## Volatility — standard deviation as a percent of price

Tells you whether the market is calm or wild. Useful for switching behavior
between conditions.

```python
def volatility_pct(prices, n=20):
    if len(prices) < n:
        return None
    window = prices[-n:]
    mean = sum(window) / n
    variance = sum((p - mean) ** 2 for p in window) / n
    return (variance ** 0.5) / mean * 100
```

## Bollinger bands

An average with bands N standard deviations above and below. Price touching
the lower band is a common "stretched too far" signal.

```python
def bollinger(prices, n=20, stds=2):
    if len(prices) < n:
        return None
    window = prices[-n:]
    mean = sum(window) / n
    variance = sum((p - mean) ** 2 for p in window) / n
    sd = variance ** 0.5
    return mean - stds * sd, mean, mean + stds * sd   # lower, mid, upper
```

## Tracking your average entry price

The engine's `state` only holds cash and coin quantity, not what you paid. To
build stop-losses or take-profits, track cost yourself in a module dict:

```python
_cost = {"spent": 0.0, "qty": 0.0}

# after a successful buy:
if engine.buy(name, state, cfg["SYMBOL"], price, amount):
    _cost["spent"] += amount
    _cost["qty"] += amount / price

def avg_entry():
    return _cost["spent"] / _cost["qty"] if _cost["qty"] else None
```

Note this resets when the bot restarts, while `state` persists to disk. For a
long-running strategy, read `trades_<name>.csv` instead.

## LOOKBACK must cover your longest indicator

`cfg["LOOKBACK"]` sets how many candles get fetched. A 30-period SMA needs at
least 31. Set `LOOKBACK` comfortably above your longest period or the
indicator silently returns `None` forever.
