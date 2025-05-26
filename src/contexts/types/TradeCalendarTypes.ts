
import type { Trade, TradeStatistics, DailyTrades, DailyJournal } from "@/types/trade";
import type { EconomicEvents } from "@/types/economic";

export interface TradeCalendarContextProps {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTrade: Trade | null;
  setSelectedTrade: React.Dispatch<React.SetStateAction<Trade | null>>;
  isWeeklyReflectionOpen: boolean;
  setIsWeeklyReflectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDailyRecapOpen: boolean;
  setIsDailyRecapOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMonthlyRecapOpen: boolean;
  setIsMonthlyRecapOpen: React.Dispatch<React.SetStateAction<boolean>>;
  weeklyReflection: string;
  setWeeklyReflection: React.Dispatch<React.SetStateAction<string>>;
  currentWeekPnL: number;
  setCurrentWeekPnL: React.Dispatch<React.SetStateAction<number>>;
  currentWeekCurrency: string;
  setCurrentWeekCurrency: React.Dispatch<React.SetStateAction<string>>;
  trades: DailyTrades;
  dailyJournals: DailyJournal[];
  economicEvents: EconomicEvents;
  calculateTradeStatistics: (trades: Trade[]) => TradeStatistics;
  onAddTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string, date: Date) => void;
  onSaveDailyJournal: (dateStr: string, content: string) => void;
  onSaveWeeklyReflection: (reflection: { weekEndDate: string; reflection: string; pnl: number; currency: string; }) => void;
  handleDayClick: (date: Date) => void;
  handleAddTrade: (trade: Trade) => void;
  handleEditTrade: (trade: Trade) => void;
  handleEditClick: (trade: Trade) => void;
  handleSaveReflection: () => void;
  handleSaveDailyJournal: (content: string) => void;
  handleDeleteTrade: (tradeId: string, date: Date) => void;
  getDailyJournalContent: (dateStr: string) => string;
  calculateMonthlyStats: (date: Date) => { monthlyTrades: Trade[]; stats: TradeStatistics };
  calculateWeeklyStats: (date: Date) => { weeklyTrades: Trade[]; stats: TradeStatistics };
}

export interface TradeCalendarProviderProps {
  children: React.ReactNode;
  trades: DailyTrades;
  dailyJournals: DailyJournal[];
  onAddTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string, date: Date) => void;
  onSaveDailyJournal: (dateStr: string, content: string) => void;
  onSaveWeeklyReflection: (reflection: { weekEndDate: string; reflection: string; pnl: number; currency: string; }) => void;
  economicEvents: EconomicEvents;
  calculateTradeStatistics: (trades: Trade[]) => TradeStatistics;
}
