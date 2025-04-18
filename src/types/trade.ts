
export interface Trade {
  id: string;
  date: Date;
  ticker: string;
  riskR: number;
  potentialR: number;
  rValue: number;
  currency: "USD" | "EUR";
  outcome: "win" | "loss";
  actualR: number;
  pnl: number;
  entryReason: string;
  exitReason: string;
  reflection: {
    whatWentWrong: string;
    whatWentRight: string;
    followedPlan: boolean;
    emotions: {
      before: string;
      during: string;
      after: string;
    };
  };
}

export type DailyTrades = {
  [date: string]: Trade[];
};
