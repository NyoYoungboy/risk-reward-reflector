
import type { Trade, TradeStatistics } from "@/types/trade";

export function useTradeStatistics() {
  const calculateTradeStatistics = (trades: Trade[]): TradeStatistics => {
    if (!trades.length) {
      return {
        winCount: 0,
        lossCount: 0,
        winRate: 0,
        totalPnl: 0,
        currency: "USD",
        longStats: {
          count: 0,
          winCount: 0,
          lossCount: 0,
          winRate: 0,
          totalPnl: 0
        },
        shortStats: {
          count: 0,
          winCount: 0,
          lossCount: 0,
          winRate: 0,
          totalPnl: 0
        }
      };
    }
    
    const winningTrades = trades.filter(trade => trade.outcome === "win");
    const winCount = winningTrades.length;
    const lossCount = trades.length - winCount;
    const winRate = trades.length > 0 ? winCount / trades.length : 0;
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const currency = trades.length > 0 ? trades[0].currency : "USD";
    
    // Long trades statistics
    const longTrades = trades.filter(trade => trade.direction === "long");
    const longWinningTrades = longTrades.filter(trade => trade.outcome === "win");
    const longWinCount = longWinningTrades.length;
    const longLossCount = longTrades.length - longWinCount;
    const longWinRate = longTrades.length > 0 ? longWinCount / longTrades.length : 0;
    const longTotalPnl = longTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    
    // Short trades statistics
    const shortTrades = trades.filter(trade => trade.direction === "short");
    const shortWinningTrades = shortTrades.filter(trade => trade.outcome === "win");
    const shortWinCount = shortWinningTrades.length;
    const shortLossCount = shortTrades.length - shortWinCount;
    const shortWinRate = shortTrades.length > 0 ? shortWinCount / shortTrades.length : 0;
    const shortTotalPnl = shortTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    
    return { 
      winCount, 
      lossCount, 
      winRate, 
      totalPnl, 
      currency,
      longStats: {
        count: longTrades.length,
        winCount: longWinCount,
        lossCount: longLossCount,
        winRate: longWinRate,
        totalPnl: longTotalPnl
      },
      shortStats: {
        count: shortTrades.length,
        winCount: shortWinCount,
        lossCount: shortLossCount,
        winRate: shortWinRate,
        totalPnl: shortTotalPnl
      }
    };
  };

  return { calculateTradeStatistics };
}
