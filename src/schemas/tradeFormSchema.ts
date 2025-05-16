
import * as z from "zod";

export const tradeFormSchema = z.object({
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

export type TradeFormValues = z.infer<typeof tradeFormSchema>;
