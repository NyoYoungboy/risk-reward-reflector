
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TradeEditForm } from "@/components/TradeEditForm";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";

export function EditTradeDialog() {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen,
    selectedTrade,
    handleEditTrade
  } = useTradeCalendar();

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Trade
          </DialogTitle>
        </DialogHeader>
        {selectedTrade && (
          <TradeEditForm
            onSubmit={handleEditTrade}
            onCancel={() => setIsEditDialogOpen(false)}
            trade={selectedTrade}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
