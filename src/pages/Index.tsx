
import React, { useState } from "react";
import { TradeCalendar } from "@/components/TradeCalendar";
import type { DailyTrades, Trade } from "@/types/trade";
import { format } from "date-fns";

interface WeeklyReflection {
  weekEndDate: string;
  reflection: string;
  pnl: number;
  currency: string;
}

export default function Index() {
  const [trades, setTrades] = useState<DailyTrades>({});
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>([]);

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
    />
  );
}
