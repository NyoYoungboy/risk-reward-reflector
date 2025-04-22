import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, startOfWeek, endOfWeek, isSunday } from "date-fns";
import { TradeForm } from "./TradeForm";
import { DailyTrades, Trade } from "@/types/trade";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

interface TradeCalendarProps {
  trades: DailyTrades;
  onAddTrade: (trade: Trade) => void;
}

export function TradeCalendar({ trades, onAddTrade }: TradeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWeeklyReflectionOpen, setIsWeeklyReflectionOpen] = useState(false);
  const [weeklyReflection, setWeeklyReflection] = useState("");

  const handleDayClick = (date: Date) => {
    if (isSunday(date)) {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      let weeklyPnL = 0;

      // Calculate weekly PnL
      for (let d = weekStart; d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = format(d, "yyyy-MM-dd");
        const dayTrades = trades[dateStr] || [];
        weeklyPnL += dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      }

      // Show weekly reflection dialog
      setSelectedDate(date);
      setIsWeeklyReflectionOpen(true);
      return;
    }

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
        weekStartsOn={1}
        className="rounded-md border w-full max-w-4xl mx-auto bg-white dark:bg-black"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center text-lg font-bold h-16",
          caption_label: "text-base font-medium",
          nav: "space-x-1 flex items-center h-16",
          nav_button: cn(
            "h-16 w-16 bg-transparent p-0 opacity-75 hover:opacity-100 text-lg"
          ),
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full",
          head_cell: "text-primary font-semibold rounded-md w-full font-normal text-sm px-0 py-2",
          row: "flex w-full mt-2",
          cell: "h-24 w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            "h-24 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground text-lg"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        components={{
          DayContent: ({ date }) => (
            <div className="h-full w-full flex flex-col p-2">
              <span className="text-lg font-medium mb-1">{format(date, "d")}</span>
              {getDayContent(date)}
            </div>
          ),
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

      <Dialog open={isWeeklyReflectionOpen} onOpenChange={setIsWeeklyReflectionOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Weekly Reflection - Week ending {selectedDate ? format(selectedDate, "PP") : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-lg">
              Weekly P&L Summary for {selectedDate ? format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "PP") : ""} - {selectedDate ? format(selectedDate, "PP") : ""}
            </div>
            <Textarea
              placeholder="Reflect on your trading week. What went well? What could be improved? Any patterns you noticed?"
              value={weeklyReflection}
              onChange={(e) => setWeeklyReflection(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsWeeklyReflectionOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setWeeklyReflection("");
                setIsWeeklyReflectionOpen(false);
              }}>
                Save Reflection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
