import React, { useState } from "react";
import { TradeCalendar } from "@/components/TradeCalendar";
import type { DailyTrades, Trade } from "@/types/trade";
import type { EconomicEvent, EconomicEvents } from "@/types/economic";
import { format } from "date-fns";

interface WeeklyReflection {
  weekEndDate: string;
  reflection: string;
  pnl: number;
  currency: string;
}

// Example economic events - in a real app, this would come from an API
const initialEconomicEvents: EconomicEvents = {
  "2025-04-10": [{
    id: "cpi-apr-2025",
    date: new Date("2025-04-10"),
    indicator: "US CPI (YoY)",
    actual: 3.2,
    previous: 3.1,
    forecast: 3.3,
    currency: "USD"
  }],
  "2025-04-26": [{
    id: "gdp-apr-2025",
    date: new Date("2025-04-26"),
    indicator: "US GDP Growth Rate (QoQ)",
    actual: 2.1,
    previous: 1.9,
    forecast: 2.0,
    currency: "USD"
  }]
};

export default function Index() {
  const [trades, setTrades] = useState<DailyTrades>({});
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>([]);
  const [economicEvents] = useState<EconomicEvents>(initialEconomicEvents);

  const handleAddTrade = (trade: Trade) => {
    const dateStr = format(trade.date, "yyyy-MM-dd");
    setTrades((prev) => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), trade],
    }));
  };

  const handleDeleteTrade = (tradeId: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setTrades((prev) => ({
      ...prev,
      [dateStr]: prev[dateStr].filter((trade) => trade.id !== tradeId),
    }));
  };

  const handleSaveReflection = (reflection: WeeklyReflection) => {
    const existingIndex = weeklyReflections.findIndex(
      (r) => r.weekEndDate === reflection.weekEndDate
    );
    
    if (existingIndex >= 0) {
      const updatedReflections = [...weeklyReflections];
      updatedReflections[existingIndex] = reflection;
      setWeeklyReflections(updatedReflections);
    } else {
      setWeeklyReflections([...weeklyReflections, reflection]);
    }
  };

  return (
    <TradeCalendar 
      trades={trades} 
      onAddTrade={handleAddTrade}
      onDeleteTrade={handleDeleteTrade}
      economicEvents={economicEvents}
    />
  );
}
