
import { format } from "date-fns";
import type { Trade, TradeStatistics, DailyTrades } from "@/types/trade";

export function useTradeCalendarStats(
  trades: DailyTrades,
  calculateTradeStatistics: (trades: Trade[]) => TradeStatistics
) {
  const calculateMonthlyStats = (date: Date) => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let monthlyTrades: Trade[] = [];

    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const dayTrades = trades[dateStr] || [];
      
      if (dayTrades.length > 0) {
        monthlyTrades = [...monthlyTrades, ...dayTrades];
      }
    }

    return { 
      monthlyTrades, 
      stats: calculateTradeStatistics(monthlyTrades)
    };
  };

  const calculateWeeklyStats = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const weekEnd = date;
    let weeklyTrades: Trade[] = [];

    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const dayTrades = trades[dateStr] || [];
      
      if (dayTrades.length > 0) {
        weeklyTrades = [...weeklyTrades, ...dayTrades];
      }
    }

    return { 
      weeklyTrades,
      stats: calculateTradeStatistics(weeklyTrades)
    };
  };

  return {
    calculateMonthlyStats,
    calculateWeeklyStats
  };
}
