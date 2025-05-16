
import React from "react";
import { Trade } from "@/types/trade";
import { TradeFormBase } from "./trade-form/TradeFormBase";

interface TradeFormProps {
  onSubmit: (data: Trade) => void;
  onCancel: () => void;
  defaultDate?: Date;
}

export function TradeForm({ onSubmit, onCancel, defaultDate = new Date() }: TradeFormProps) {
  return (
    <TradeFormBase
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEditing={false}
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
