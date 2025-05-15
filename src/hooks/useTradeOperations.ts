
import type { DailyTrades, Trade, DailyJournal } from "@/types/trade";
import type { WeeklyReflection } from "./useTradingData";
import { useTradeActions } from "./trade/useTradeActions";
import { useJournalActions } from "./journal/useJournalActions";
import { useTradeStatistics } from "./trade/useTradeStatistics";

export function useTradeOperations(
  trades: DailyTrades,
  setTrades: React.Dispatch<React.SetStateAction<DailyTrades>>,
  weeklyReflections: WeeklyReflection[],
  setWeeklyReflections: React.Dispatch<React.SetStateAction<WeeklyReflection[]>>,
  dailyJournals: DailyJournal[],
  setDailyJournals: React.Dispatch<React.SetStateAction<DailyJournal[]>>,
  userId?: string
) {
  const { handleAddTrade, handleEditTrade, handleDeleteTrade } = useTradeActions(trades, setTrades, userId);
  
  const { handleSaveReflection, handleSaveDailyJournal } = useJournalActions(
    weeklyReflections, 
    setWeeklyReflections,
    dailyJournals,
    setDailyJournals,
    userId
  );
  
  const { calculateTradeStatistics } = useTradeStatistics();

  return { 
    handleAddTrade, 
    handleEditTrade,
    handleDeleteTrade, 
    handleSaveReflection,
    handleSaveDailyJournal,
    calculateTradeStatistics
  };
}
