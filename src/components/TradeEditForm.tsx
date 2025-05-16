
import React from "react";
import { Trade } from "@/types/trade";
import { TradeFormBase } from "./trade-form/TradeFormBase";

interface TradeEditFormProps {
  onSubmit: (data: Trade) => void;
  onCancel: () => void;
  trade: Trade;
}

export function TradeEditForm({ onSubmit, onCancel, trade }: TradeEditFormProps) {
  return (
    <TradeFormBase
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEditing={true}
      existingTrade={trade}
      defaultValues={{
        ticker: trade.ticker,
        direction: trade.direction || "long", // Default to "long" for backward compatibility
        riskR: trade.riskR,
        potentialR: trade.potentialR,
        rValue: trade.rValue,
        currency: trade.currency,
        outcome: trade.outcome,
        actualR: trade.actualR,
        entryReason: trade.entryReason,
        exitReason: trade.exitReason,
        whatWentWrong: trade.reflection.whatWentWrong,
        whatWentRight: trade.reflection.whatWentRight,
        followedPlan: trade.reflection.followedPlan,
        emotionsBefore: trade.reflection.emotions.before,
        emotionsDuring: trade.reflection.emotions.during,
        emotionsAfter: trade.reflection.emotions.after,
      }}
    />
  );
}
