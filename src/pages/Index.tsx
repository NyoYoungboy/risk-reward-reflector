
import React, { useState } from "react";
import { TradeCalendar } from "@/components/TradeCalendar";
import type { DailyTrades, Trade } from "@/types/trade";
import { format } from "date-fns";

export default function Index() {
  const [trades, setTrades] = useState<DailyTrades>({});

  const handleAddTrade = (trade: Trade) => {
    const dateStr = format(trade.date, "yyyy-MM-dd");
    setTrades((prev) => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), trade],
    }));
  };

  return <TradeCalendar trades={trades} onAddTrade={handleAddTrade} />;
}
