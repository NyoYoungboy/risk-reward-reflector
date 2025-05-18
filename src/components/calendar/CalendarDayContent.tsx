
import React from "react";
import { format, isLastDayOfMonth, isSaturday, isSunday } from "date-fns";
import { ChartLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";

interface CalendarDayContentProps {
  date: Date;
}

export function CalendarDayContent({ date }: CalendarDayContentProps) {
  const { 
    trades, 
    dailyJournals, 
    economicEvents, 
    calculateMonthlyStats, 
    calculateWeeklyStats,
    handleDayClick 
  } = useTradeCalendar();
  
  const dateStr = format(date, "yyyy-MM-dd");
  const dayTrades = trades[dateStr] || [];
  const dayEvents = economicEvents[dateStr] || [];
  const hasJournal = dailyJournals.some(j => j.date === dateStr);
  
  if (isLastDayOfMonth(date)) {
    const { stats } = calculateMonthlyStats(date);
    return (
      <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(date)}>
        <div className="text-xs font-medium text-purple-500">Month End</div>
        <div className={cn(
          "text-xs font-medium",
          stats.totalPnl > 0 ? "text-green-500" : "text-red-500"
        )}>
          {stats.totalPnl.toFixed(2)} {stats.currency}
        </div>
        <div className="text-xs text-muted-foreground">
          Win rate: {(stats.winRate * 100).toFixed(0)}%
        </div>
        {dayEvents.length > 0 && (
          <div className="mt-1">
            <ChartLine className="h-4 w-4 text-blue-500" />
          </div>
        )}
      </div>
    );
  }

  if (isSunday(date)) {
    // Get the stats for the previous week (Sunday to Saturday)
    const previousWeekEnd = new Date(date);
    previousWeekEnd.setDate(date.getDate() - 1); // Get Saturday (end of previous week)
    const { stats } = calculateWeeklyStats(previousWeekEnd);
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(date)}>
        <div className="text-xs font-medium text-violet-500">
          Week Summary
        </div>
        <div className={cn(
          "text-xs font-medium",
          stats.totalPnl > 0 ? "text-green-500" : "text-red-500"
        )}>
          {stats.totalPnl.toFixed(2)} {stats.currency}
        </div>
        <div className="text-xs text-muted-foreground">
          Win rate: {(stats.winRate * 100).toFixed(0)}%
        </div>
        {/* Show long/short stats */}
        <div className="text-[10px] text-muted-foreground">
          L:{stats.longStats.count} S:{stats.shortStats.count}
        </div>
        {/* Show upcoming events if any */}
        {upcomingEventsCheck(date, economicEvents)}
      </div>
    );
  }
  
  if (isSaturday(date)) {
    const { stats } = calculateWeeklyStats(date);
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(date)}>
        <div className="text-xs font-medium text-violet-500">
          Weekly Summary
        </div>
        <div className={cn(
          "text-xs font-medium",
          stats.totalPnl > 0 ? "text-green-500" : "text-red-500"
        )}>
          {stats.totalPnl.toFixed(2)} {stats.currency}
        </div>
        {hasJournal && (
          <div className="text-xs font-medium text-amber-500">
            Journal
          </div>
        )}
      </div>
    );
  }
  
  // Regular day
  const elements = [];
  
  if (dayTrades.length > 0) {
    const totalPnL = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const isProfit = totalPnL > 0;

    elements.push(
      <React.Fragment key="trades">
        <div className={cn(
          "text-xs font-medium",
          isProfit ? "text-green-500" : "text-red-500"
        )}>
          {totalPnL.toFixed(2)} {dayTrades[0].currency}
        </div>
        <div className="text-xs text-muted-foreground">
          {dayTrades.length} trade{dayTrades.length > 1 ? "s" : ""}
        </div>
      </React.Fragment>
    );
  }
  
  if (hasJournal) {
    elements.push(
      <div key="journal" className="text-xs font-medium text-amber-500">
        Journal
      </div>
    );
  }
  
  if (dayEvents.length > 0) {
    elements.push(
      <div key="events" className="mt-1 flex items-center">
        <ChartLine className="h-4 w-4 text-blue-500" />
      </div>
    );
  }
  
  if (elements.length > 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(date)}>
        {elements}
      </div>
    );
  }
  
  return null;
}

// Helper function to check for upcoming events
function upcomingEventsCheck(date: Date, economicEvents: any) {
  const nextWeekStart = date;
  const nextWeekEnd = new Date(date);
  nextWeekEnd.setDate(date.getDate() + 6);
  let upcomingEventsCount = 0;

  for (let d = new Date(nextWeekStart); d <= nextWeekEnd; d.setDate(d.getDate() + 1)) {
    const nextDateStr = format(d, "yyyy-MM-dd");
    if (economicEvents[nextDateStr]) {
      upcomingEventsCount += economicEvents[nextDateStr].length;
    }
  }

  if (upcomingEventsCount > 0) {
    return (
      <div className="text-[10px] text-muted-foreground">
        {upcomingEventsCount} econ event{upcomingEventsCount > 1 ? 's' : ''}
      </div>
    );
  }
  
  return null;
}
