
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { EconomicEvents } from "@/types/economic";
import type { DailyTrades, Trade, TradeStatistics, DailyJournal } from "@/types/trade";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TradeCalendarProvider } from "@/contexts/TradeCalendarContext";
import { AddTradeDialog } from "@/components/dialogs/AddTradeDialog";
import { EditTradeDialog } from "@/components/dialogs/EditTradeDialog";
import { DailyRecapDialog } from "@/components/dialogs/DailyRecapDialog";
import { WeeklyReflectionDialog } from "@/components/dialogs/WeeklyReflectionDialog";
import { MonthlyRecapDialog } from "@/components/dialogs/MonthlyRecapDialog";
import { CalendarDayContent } from "@/components/calendar/CalendarDayContent";

interface TradeCalendarProps {
  trades: DailyTrades;
  dailyJournals: DailyJournal[];
  onAddTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string, date: Date) => void;
  onSaveDailyJournal: (dateStr: string, content: string) => void;
  onSaveWeeklyReflection: (reflection: { weekEndDate: string; reflection: string; pnl: number; currency: string; }) => void;
  economicEvents: EconomicEvents;
  calculateTradeStatistics: (trades: Trade[]) => TradeStatistics;
}

export function TradeCalendar({ 
  trades,
  dailyJournals, 
  onAddTrade, 
  onEditTrade,
  onDeleteTrade, 
  onSaveDailyJournal,
  onSaveWeeklyReflection,
  economicEvents,
  calculateTradeStatistics
}: TradeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <TradeCalendarProvider
      trades={trades}
      dailyJournals={dailyJournals}
      onAddTrade={onAddTrade}
      onEditTrade={onEditTrade}
      onDeleteTrade={onDeleteTrade}
      onSaveDailyJournal={onSaveDailyJournal}
      onSaveWeeklyReflection={onSaveWeeklyReflection}
      economicEvents={economicEvents}
      calculateTradeStatistics={calculateTradeStatistics}
    >
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
          onSelect={setSelectedDate}
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
                <CalendarDayContent date={date} />
              </div>
            ),
          }}
        />

        {/* Dialogs */}
        <AddTradeDialog />
        <EditTradeDialog />
        <DailyRecapDialog />
        <WeeklyReflectionDialog />
        <MonthlyRecapDialog />
      </div>
    </TradeCalendarProvider>
  );
}
