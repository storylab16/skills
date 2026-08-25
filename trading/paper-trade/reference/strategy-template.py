"""
STRATEGY NAME
=============
One-line description of the rule in plain language.

Works well when:  <market condition this strategy likes>
Struggles when:   <market condition that hurts it>

Run:  python3 thisfile.py
"""

import engine

cfg = {
    # --- shared settings (every strategy has these) ---
    "SYMBOL": "BTCUSDT",     # trading pair
    "INTERVAL": "1m",        # candle size for the price feed
    "CHECK_SECONDS": 60,     # how often the loop runs
    "STARTING_USDT": 60.0,   # simulated starting cash
    "LOOKBACK": 60,          # how many past candles to fetch

    # --- strategy-specific settings (tune these) ---
    "EXAMPLE_THRESHOLD": 3.0,   # explain what this number means
    "TRADE_AMOUNT_USDT": 5.0,   # how much to buy/sell each signal
}

# Module-level dict for anything that must survive between checks.
# (A plain variable won't work — decide() can't reassign it.)
_memory = {"last_price": None}


def decide(name, state, prices, price, cfg):
    """
    Called once per check.

    state  — {"usdt": cash, "asset": coins held}
    prices — list of recent closing prices, oldest first
    price  — the current price (same as prices[-1])

    Call engine.buy(...) / engine.sell(...) to act. Return value is ignored.
    """
    if len(prices) < 2:
        return  # not enough history yet

    # --- your rule goes here ---
    # Example: buy when price is THRESHOLD% below the average
    average = sum(prices) / len(prices)
    drop_pct = (average - price) / average * 100

    if drop_pct >= cfg["EXAMPLE_THRESHOLD"]:
        engine.buy(name, state, cfg["SYMBOL"], price, cfg["TRADE_AMOUNT_USDT"])

    # To sell, work out a quantity first:
    # qty = cfg["TRADE_AMOUNT_USDT"] / price
    # engine.sell(name, state, cfg["SYMBOL"], price, qty)
    #
    # To sell everything:
    # engine.sell(name, state, cfg["SYMBOL"], price, state["asset"])


if __name__ == "__main__":
    # The name here decides the filenames: state_<name>.json, trades_<name>.csv
    engine.run_bot("template", cfg, decide)
