
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TradeForm } from "@/components/TradeForm";
import { format } from "date-fns";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";

export function AddTradeDialog() {
  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    selectedDate, 
    handleAddTrade
  } = useTradeCalendar();

  return (
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
  );
}
