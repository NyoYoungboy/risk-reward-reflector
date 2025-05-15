
import type { Trade, TradeStatistics } from "@/types/trade";

export function useTradeStatistics() {
  const calculateTradeStatistics = (trades: Trade[]): TradeStatistics => {
    if (!trades.length) {
      return {
        winCount: 0,
        lossCount: 0,
        winRate: 0,
        totalPnl: 0,
        currency: "USD"
      };
    }
    
    const winningTrades = trades.filter(trade => trade.outcome === "win");
    const winCount = winningTrades.length;
    const lossCount = trades.length - winCount;
    const winRate = trades.length > 0 ? winCount / trades.length : 0;
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const currency = trades.length > 0 ? trades[0].currency : "USD";
    
    return { winCount, lossCount, winRate, totalPnl, currency };
  };

  return { calculateTradeStatistics };
}
