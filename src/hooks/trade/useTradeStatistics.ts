
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
    const losingTrades = trades.filter(trade => trade.outcome === "loss");
    const breakevenTrades = trades.filter(trade => trade.outcome === "breakeven");
    
    const winCount = winningTrades.length;
    const lossCount = losingTrades.length;
    // We only count wins and losses for win rate, excluding breakeven trades
    const totalWinLossTrades = winCount + lossCount;
    const winRate = totalWinLossTrades > 0 ? winCount / totalWinLossTrades : 0;
    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const currency = trades.length > 0 ? trades[0].currency : "USD";
    
    // Long trades statistics
    const longTrades = trades.filter(trade => trade.direction === "long");
    const longWinningTrades = longTrades.filter(trade => trade.outcome === "win");
    const longLosingTrades = longTrades.filter(trade => trade.outcome === "loss");
    const longWinCount = longWinningTrades.length;
    const longLossCount = longLosingTrades.length;
    const longTotalWinLossTrades = longWinCount + longLossCount;
    const longWinRate = longTotalWinLossTrades > 0 ? longWinCount / longTotalWinLossTrades : 0;
    const longTotalPnl = longTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    
    // Short trades statistics
    const shortTrades = trades.filter(trade => trade.direction === "short");
    const shortWinningTrades = shortTrades.filter(trade => trade.outcome === "win");
    const shortLosingTrades = shortTrades.filter(trade => trade.outcome === "loss");
    const shortWinCount = shortWinningTrades.length;
    const shortLossCount = shortLosingTrades.length;
    const shortTotalWinLossTrades = shortWinCount + shortLossCount;
    const shortWinRate = shortTotalWinLossTrades > 0 ? shortWinCount / shortTotalWinLossTrades : 0;
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
