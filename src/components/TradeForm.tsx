
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Trade } from "@/types/trade";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const tradeFormSchema = z.object({
  ticker: z.string().min(1, "Ticker is required"),
  riskR: z.string().transform((val) => Number(val)),
  potentialR: z.string().transform((val) => Number(val)),
  rValue: z.string().transform((val) => Number(val)),
  currency: z.enum(["USD", "EUR"]),
  outcome: z.enum(["win", "loss"]),
  actualR: z.string().transform((val) => Number(val)),
  entryReason: z.string(),
  exitReason: z.string(),
  whatWentWrong: z.string(),
  whatWentRight: z.string(),
  followedPlan: z.boolean(),
  emotionsBefore: z.string(),
  emotionsDuring: z.string(),
  emotionsAfter: z.string(),
});

interface TradeFormProps {
  onSubmit: (data: Trade) => void;
  onCancel: () => void;
  defaultDate?: Date;
}

export function TradeForm({ onSubmit, onCancel, defaultDate = new Date() }: TradeFormProps) {
  const form = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      ticker: "",
      riskR: "1",
      potentialR: "",
      rValue: "",
      currency: "USD",
      outcome: "win",
      actualR: "",
      entryReason: "",
      exitReason: "",
      whatWentWrong: "",
      whatWentRight: "",
      followedPlan: true,
      emotionsBefore: "",
      emotionsDuring: "",
      emotionsAfter: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof tradeFormSchema>) => {
    const pnl = values.rValue * values.actualR;
    const trade: Trade = {
      id: Date.now().toString(),
      date: defaultDate,
      ...values,
      riskR: Number(values.riskR),
      potentialR: Number(values.potentialR),
      rValue: Number(values.rValue),
      actualR: Number(values.actualR),
      pnl,
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
    onSubmit(trade);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ticker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticker</FormLabel>
                <FormControl>
                  <Input placeholder="BTC/USDT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>R Value</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="500" {...field} />
                </FormControl>
                <FormDescription>Amount per R in currency</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="outcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outcome</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actualR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual R Multiple</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="2.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Trade</Button>
        </div>
      </form>
    </Form>
  );
}
