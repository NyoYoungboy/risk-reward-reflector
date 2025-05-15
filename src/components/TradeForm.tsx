import React, { useState } from "react";
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
import { Camera } from "lucide-react";
import type { Trade } from "@/types/trade";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";

const tradeFormSchema = z.object({
  ticker: z.string().min(1, "Ticker is required"),
  direction: z.enum(["long", "short"], {
    required_error: "Please select a trade direction",
  }),
  riskR: z.coerce.number(),
  potentialR: z.coerce.number(),
  rValue: z.coerce.number(),
  currency: z.enum(["USD", "EUR"]),
  outcome: z.enum(["win", "loss"]),
  actualR: z.coerce.number(),
  entryReason: z.string(),
  exitReason: z.string(),
  whatWentWrong: z.string(),
  whatWentRight: z.string(),
  followedPlan: z.boolean(),
  emotionsBefore: z.string(),
  emotionsDuring: z.string(),
  emotionsAfter: z.string(),
  screenshot: z.any().optional(),
});

interface TradeFormProps {
  onSubmit: (data: Trade) => void;
  onCancel: () => void;
  defaultDate?: Date;
}

export function TradeForm({ onSubmit, onCancel, defaultDate = new Date() }: TradeFormProps) {
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
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
    },
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

  const handleSubmit = (values: z.infer<typeof tradeFormSchema>) => {
    const pnl = values.rValue * values.actualR;
    const trade: Trade = {
      id: Date.now().toString(),
      date: defaultDate,
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
            name="direction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direction</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
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
          
          <FormField
            control={form.control}
            name="screenshot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trade Screenshot</FormLabel>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-md hover:bg-accent">
                    <Camera size={20} />
                    <span>Upload Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleScreenshotUpload(e);
                        field.onChange(e);
                      }}
                    />
                  </label>
                  {screenshotPreview && (
                    <Card className="mt-2 overflow-hidden">
                      <CardContent className="p-2">
                        <img
                          src={screenshotPreview}
                          alt="Trade Screenshot"
                          className="w-full h-auto max-h-64 object-contain"
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
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
