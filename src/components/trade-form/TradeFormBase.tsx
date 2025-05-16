
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tradeFormSchema, TradeFormValues } from "@/schemas/tradeFormSchema";
import { Trade } from "@/types/trade";
import { TradeBasicFields } from "./TradeBasicFields";
import { TradeReasonFields } from "./TradeReasonFields";
import { TradeReflectionFields } from "./TradeReflectionFields";
import { TradeEmotionFields } from "./TradeEmotionFields";
import { TradeScreenshotField } from "./TradeScreenshotField";
import { TradeFormActions } from "./TradeFormActions";

interface TradeFormBaseProps {
  onSubmit: (trade: Trade) => void;
  onCancel: () => void;
  defaultValues: Partial<TradeFormValues>;
  isEditing?: boolean;
  existingTrade?: Trade;
}

export function TradeFormBase({ 
  onSubmit, 
  onCancel, 
  defaultValues, 
  isEditing = false,
  existingTrade 
}: TradeFormBaseProps) {
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    isEditing && existingTrade?.screenshot ? existingTrade.screenshot : null
  );
  
  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues,
  });

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setScreenshotPreview(result);
        form.setValue("screenshot", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (values: TradeFormValues) => {
    const pnl = values.rValue * values.actualR;
    
    const tradeData: Trade = {
      id: existingTrade?.id || Date.now().toString(),
      date: existingTrade?.date || new Date(),
      ticker: values.ticker,
      direction: values.direction,
      riskR: values.riskR,
      potentialR: values.potentialR,
      rValue: values.rValue,
      currency: values.currency,
      outcome: values.outcome,
      actualR: values.actualR,
      pnl,
      entryReason: values.entryReason,
      exitReason: values.exitReason,
      screenshot: screenshotPreview || undefined,
      reflection: {
        whatWentWrong: values.whatWentWrong,
        whatWentRight: values.whatWentRight,
        followedPlan: values.followedPlan,
        emotions: {
          before: values.emotionsBefore,
          during: values.emotionsDuring,
          after: values.emotionsAfter,
        },
      },
    };
    
    onSubmit(tradeData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TradeBasicFields form={form} />
          <TradeScreenshotField 
            form={form} 
            screenshotPreview={screenshotPreview} 
            onScreenshotUpload={handleScreenshotUpload} 
          />
        </div>

        <TradeReasonFields form={form} />
        <TradeReflectionFields form={form} />
        <TradeEmotionFields form={form} />
        
        <TradeFormActions onCancel={onCancel} isEditing={isEditing} />
      </form>
    </Form>
  );
}
