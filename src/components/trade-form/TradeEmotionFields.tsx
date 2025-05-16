
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TradeFormValues } from "@/schemas/tradeFormSchema";

interface TradeEmotionFieldsProps {
  form: UseFormReturn<TradeFormValues>;
}

export function TradeEmotionFields({ form }: TradeEmotionFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Emotional State</h3>
      
      <FormField
        control={form.control}
        name="emotionsBefore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Before Trade</FormLabel>
            <FormControl>
              <Textarea placeholder="How were you feeling before the trade?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="emotionsDuring"
        render={({ field }) => (
          <FormItem>
            <FormLabel>During Trade</FormLabel>
            <FormControl>
              <Textarea placeholder="How were you feeling during the trade?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="emotionsAfter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>After Trade</FormLabel>
            <FormControl>
              <Textarea placeholder="How were you feeling after the trade?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
