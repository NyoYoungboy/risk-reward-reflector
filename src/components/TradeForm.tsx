
import React from "react";
import { Trade } from "@/types/trade";
import { TradeFormBase } from "./trade-form/TradeFormBase";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";

interface TradeFormProps {
  onSubmit: (data: Trade) => void;
  onCancel: () => void;
  defaultDate?: Date;
}

export function TradeForm({ onSubmit, onCancel, defaultDate }: TradeFormProps) {
  const { selectedDate } = useTradeCalendar();
  
  // Use selectedDate from context if available, otherwise use defaultDate or today
  const formDate = selectedDate || defaultDate || new Date();
  
  return (
    <TradeFormBase
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEditing={false}
      defaultDate={formDate}
      defaultValues={{
        ticker: "",
        direction: "long",
        riskR: 1,
        potentialR: 0,
        rValue: 0,
        currency: "USD",
        outcome: "win",
        actualR: 0,
        entryReason: "",
        exitReason: "",
        whatWentWrong: "",
        whatWentRight: "",
        followedPlan: true,
        emotionsBefore: "",
        emotionsDuring: "",
        emotionsAfter: "",
      }}
    />
  );
}
