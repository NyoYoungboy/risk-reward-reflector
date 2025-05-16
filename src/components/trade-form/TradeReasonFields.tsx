
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TradeFormValues } from "@/schemas/tradeFormSchema";

interface TradeReasonFieldsProps {
  form: UseFormReturn<TradeFormValues>;
}

export function TradeReasonFields({ form }: TradeReasonFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="entryReason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry Reason</FormLabel>
            <FormControl>
              <Textarea placeholder="Why did you enter this trade?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exitReason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exit Reason</FormLabel>
            <FormControl>
              <Textarea placeholder="Why did you exit this trade?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
