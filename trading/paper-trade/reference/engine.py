"""
Shared paper-trading engine used by all strategy templates.

You don't run this file directly. Each strategy file (dca.py, grid.py,
sma.py) imports from here and calls run_bot() with its own decide()
function.

Everything here is PAPER trading — simulated money, real live prices,
no API key, no connection to your real Binance account.
"""

import time
import json
import csv
import os
from datetime import datetime

import requests

BASE_URL = "https://api.binance.com"


def get_klines(symbol, interval, limit):
    """Fetch recent closing prices from Binance's public API (no auth)."""
    resp = requests.get(
        f"{BASE_URL}/api/v3/klines",
        params={"symbol": symbol, "interval": interval, "limit": limit},
        timeout=10,
    )
    resp.raise_for_status()
    return [float(k[4]) for k in resp.json()]


def _state_file(name):
    return os.path.join(os.path.dirname(__file__), f"state_{name}.json")


def _trade_log(name):
    return os.path.join(os.path.dirname(__file__), f"trades_{name}.csv")


def load_state(name, starting_usdt):
    path = _state_file(name)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    # 'asset' = how much of the coin we hold; 'usdt' = cash left
    return {"usdt": starting_usdt, "asset": 0.0}


def save_state(name, state):
    with open(_state_file(name), "w") as f:
        json.dump(state, f, indent=2)


def log_trade(name, side, symbol, price, qty):
    path = _trade_log(name)
    is_new = not os.path.exists(path)
    with open(path, "a", newline="") as f:
        writer = csv.writer(f)
        if is_new:
            writer.writerow(["timestamp", "strategy", "side", "symbol", "price", "qty"])
        writer.writerow([datetime.utcnow().isoformat(), name, side, symbol, price, qty])


def buy(name, state, symbol, price, usdt_amount):
    """Simulate buying `usdt_amount` worth of the coin."""
    if state["usdt"] < usdt_amount or usdt_amount < 1:
        return False
    qty = usdt_amount / price
    state["usdt"] -= usdt_amount
    state["asset"] += qty
    save_state(name, state)
    log_trade(name, "BUY", symbol, price, qty)
    print(f"  [BUY]  {qty:.6f} {symbol} at {price:.2f} "
          f"(spent {usdt_amount:.2f}, cash left {state['usdt']:.2f})")
    return True


def sell(name, state, symbol, price, qty):
    """Simulate selling `qty` of the coin."""
    qty = min(qty, state["asset"])
    if qty <= 0:
        return False
    proceeds = qty * price
    state["asset"] -= qty
    state["usdt"] += proceeds
    save_state(name, state)
    log_trade(name, "SELL", symbol, price, qty)
    print(f"  [SELL] {qty:.6f} {symbol} at {price:.2f} "
          f"(got {proceeds:.2f}, cash now {state['usdt']:.2f})")
    return True


def portfolio_value(state, price):
    """Total value = cash + coins valued at current price."""
    return state["usdt"] + state["asset"] * price


def run_bot(name, cfg, decide):
    """
    Main loop. `decide(state, prices, price, cfg)` is the strategy function;
    it inspects the market and calls buy()/sell() as needed.
    """
    print(f"Starting {name.upper()} strategy | {cfg['SYMBOL']} | "
          f"interval={cfg['INTERVAL']} | paper mode")
    state = load_state(name, cfg["STARTING_USDT"])

    while True:
        try:
            prices = get_klines(cfg["SYMBOL"], cfg["INTERVAL"], cfg.get("LOOKBACK", 60))
            price = prices[-1]
            value = portfolio_value(state, price)
            print(f"{datetime.utcnow().isoformat()} price={price:.2f} "
                  f"| cash={state['usdt']:.2f} coins={state['asset']:.6f} "
                  f"total={value:.2f}")
            decide(name, state, prices, price, cfg)
        except Exception as e:
            print(f"  error: {e}")
        time.sleep(cfg["CHECK_SECONDS"])
