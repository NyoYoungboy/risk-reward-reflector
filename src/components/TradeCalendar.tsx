
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { TradeForm } from "./TradeForm";
import { DailyTrades, Trade } from "@/types/trade";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradeCalendarProps {
  trades: DailyTrades;
  onAddTrade: (trade: Trade) => void;
}

export function TradeCalendar({ trades, onAddTrade }: TradeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleAddTrade = (trade: Trade) => {
    onAddTrade(trade);
    setIsDialogOpen(false);
  };

  const getDayContent = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayTrades = trades[dateStr] || [];
    
    if (dayTrades.length === 0) return null;

    const totalPnL = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const isProfit = totalPnL > 0;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div
          className={cn(
            "text-xs font-medium",
            isProfit ? "text-green-500" : "text-red-500"
          )}
        >
          {totalPnL.toFixed(2)} {dayTrades[0].currency}
        </div>
        <div className="text-xs text-muted-foreground">
          {dayTrades.length} trade{dayTrades.length > 1 ? "s" : ""}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Journal</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Trade
        </Button>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDayClick}
        className="rounded-md border w-full max-w-4xl mx-auto [&_.rdp-cell]:h-24 [&_.rdp-table]:w-full [&_.rdp-head_th]:!px-0 [&_.rdp-day_div]:h-full [&_.rdp-day_div]:w-full"
        components={{
          DayContent: ({ date }) => getDayContent(date),
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add Trade for {selectedDate ? format(selectedDate, "PP") : "Today"}
            </DialogTitle>
          </DialogHeader>
          <TradeForm
            onSubmit={handleAddTrade}
            onCancel={() => setIsDialogOpen(false)}
            defaultDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
