
import React from "react";
import { Button } from "@/components/ui/button";

interface TradeFormActionsProps {
  onCancel: () => void;
  isEditing?: boolean;
}

export function TradeFormActions({ onCancel, isEditing = false }: TradeFormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">{isEditing ? "Save Changes" : "Save Trade"}</Button>
    </div>
  );
}
