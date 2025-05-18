
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JournalEntry } from "@/components/JournalEntry";
import { format } from "date-fns";
import { TradeStatisticsSummary } from "@/components/TradeStatistics";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";

export function WeeklyReflectionDialog() {
  const { 
    isWeeklyReflectionOpen, 
    setIsWeeklyReflectionOpen,
    selectedDate,
    weeklyReflection,
    calculateWeeklyStats,
    handleSaveReflection
  } = useTradeCalendar();

  return (
    <Dialog open={isWeeklyReflectionOpen} onOpenChange={setIsWeeklyReflectionOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Weekly Reflection - Week ending {selectedDate ? format(selectedDate, "PP") : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedDate && (
            <>
              <TradeStatisticsSummary 
                stats={calculateWeeklyStats(selectedDate).stats} 
                title="Weekly Performance"
              />
              
              <JournalEntry
                date={selectedDate}
                content={weeklyReflection}
                onSave={(content) => {
                  setIsWeeklyReflectionOpen(false);
                  handleSaveReflection();
                }}
                title="Weekly Reflection"
                placeholder="Reflect on your trading week. What went well? What could be improved? Any patterns you noticed?"
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
