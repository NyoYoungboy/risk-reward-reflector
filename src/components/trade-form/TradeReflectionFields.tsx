
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TradeFormValues } from "@/schemas/tradeFormSchema";

interface TradeReflectionFieldsProps {
  form: UseFormReturn<TradeFormValues>;
}

export function TradeReflectionFields({ form }: TradeReflectionFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Trade Reflection</h3>
      
      <FormField
        control={form.control}
        name="whatWentWrong"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What Went Wrong</FormLabel>
            <FormControl>
              <Textarea placeholder="What aspects of the trade didn't go as planned?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="whatWentRight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What Went Right</FormLabel>
            <FormControl>
              <Textarea placeholder="What aspects of the trade went well?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="followedPlan"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="w-4 h-4"
              />
            </FormControl>
            <FormLabel>Followed Trading Plan</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
