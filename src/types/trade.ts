
export interface Trade {
  id: string;
  date: Date;
  ticker: string;
  direction: "long" | "short";
  riskR: number;
  potentialR: number;
  rValue: number;
  currency: "USD" | "EUR";
  outcome: "win" | "loss";
  actualR: number;
  pnl: number;
  entryReason: string;
  exitReason: string;
  screenshot?: string; // Optional URL to the screenshot image
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

export interface DailyJournal {
  id: string;
  date: string;
  content: string;
}

export interface TradeStatistics {
  winCount: number;
  lossCount: number;
  winRate: number;
  totalPnl: number;
  currency: string;
  longStats: {
    count: number;
    winCount: number;
    lossCount: number;
    winRate: number;
    totalPnl: number;
  };
  shortStats: {
    count: number;
    winCount: number;
    lossCount: number;
    winRate: number;
    totalPnl: number;
  };
}
