
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JournalEntry } from "@/components/JournalEntry";
import { format } from "date-fns";
import { TradeStatisticsSummary } from "@/components/TradeStatistics";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function WeeklyReflectionDialog() {
  const { 
    isWeeklyReflectionOpen, 
    setIsWeeklyReflectionOpen,
    selectedDate,
    weeklyReflection,
    calculateWeeklyStats,
    handleSaveReflection,
    setWeeklyReflection,
    setCurrentWeekPnL,
    setCurrentWeekCurrency
  } = useTradeCalendar();

  // Calculate weekly statistics whenever the dialog is opened or selectedDate changes
  useEffect(() => {
    if (isWeeklyReflectionOpen && selectedDate) {
      const { stats, weeklyTrades } = calculateWeeklyStats(selectedDate);
      setCurrentWeekPnL(stats.totalPnl);
      setCurrentWeekCurrency(stats.currency);
    }
  }, [isWeeklyReflectionOpen, selectedDate, calculateWeeklyStats, setCurrentWeekPnL, setCurrentWeekCurrency]);

  if (!selectedDate) {
    return null;
  }

  const { stats, weeklyTrades } = calculateWeeklyStats(selectedDate);
  
  return (
    <Dialog open={isWeeklyReflectionOpen} onOpenChange={setIsWeeklyReflectionOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Weekly Reflection - Week ending {format(selectedDate, "PP")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <TradeStatisticsSummary 
            stats={stats} 
            title="Weekly Performance"
          />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Weekly Trades</h3>
            {weeklyTrades.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{format(new Date(trade.date), "MM/dd")}</TableCell>
                      <TableCell className="font-medium">{trade.ticker}</TableCell>
                      <TableCell>{trade.direction === "long" ? "Long" : "Short"}</TableCell>
                      <TableCell>
                        <span className={cn(
                          trade.outcome === "win" && "text-green-500",
                          trade.outcome === "loss" && "text-red-500",
                          trade.outcome === "breakeven" && "text-gray-500"
                        )}>
                          {trade.outcome.charAt(0).toUpperCase() + trade.outcome.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        trade.pnl > 0 ? "text-green-500" : trade.pnl < 0 ? "text-red-500" : "text-gray-500"
                      )}>
                        {trade.pnl.toFixed(2)} {trade.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No trades recorded for this week
              </div>
            )}
          </div>
          
          <JournalEntry
            date={selectedDate}
            content={weeklyReflection}
            onSave={(content) => {
              setWeeklyReflection(content);
              setIsWeeklyReflectionOpen(false);
              handleSaveReflection();
            }}
            title="Weekly Reflection"
            placeholder="Reflect on your trading week. What went well? What could be improved? Any patterns you noticed?"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
