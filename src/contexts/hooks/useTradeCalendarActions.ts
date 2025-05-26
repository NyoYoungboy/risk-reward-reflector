
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Trade } from "@/types/trade";

export function useTradeCalendarActions(
  selectedDate: Date | undefined,
  weeklyReflection: string,
  currentWeekPnL: number,
  currentWeekCurrency: string,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedTrade: React.Dispatch<React.SetStateAction<Trade | null>>,
  setIsWeeklyReflectionOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDailyRecapOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsMonthlyRecapOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onAddTrade: (trade: Trade) => void,
  onEditTrade: (trade: Trade) => void,
  onDeleteTrade: (tradeId: string, date: Date) => void,
  onSaveDailyJournal: (dateStr: string, content: string) => void,
  onSaveWeeklyReflection: (reflection: { weekEndDate: string; reflection: string; pnl: number; currency: string; }) => void
) {
  const { toast } = useToast();

  const handleDayClick = (date: Date) => {
    if (date.getDate() === new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
      setIsMonthlyRecapOpen(true);
      return;
    }

    if (date.getDay() === 6) { // Saturday
      setIsDailyRecapOpen(true);
    } else if (date.getDay() === 0) { // Sunday - open weekly reflection
      setIsWeeklyReflectionOpen(true);
    } else {
      setIsDailyRecapOpen(true);
    }
  };

  const handleAddTrade = (trade: Trade) => {
    onAddTrade(trade);
    setIsDialogOpen(false);
  };

  const handleEditTrade = (trade: Trade) => {
    onEditTrade(trade);
    setIsEditDialogOpen(false);
    setSelectedTrade(null);
  };

  const handleEditClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditDialogOpen(true);
  };

  const handleSaveReflection = () => {
    if (!selectedDate) return;
    
    const weekEndDate = format(selectedDate, "yyyy-MM-dd");
    onSaveWeeklyReflection({
      weekEndDate,
      reflection: weeklyReflection,
      pnl: currentWeekPnL,
      currency: currentWeekCurrency
    });
    
    setIsWeeklyReflectionOpen(false);
  };

  const handleSaveDailyJournal = (content: string) => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    onSaveDailyJournal(dateStr, content);
  };

  const handleDeleteTrade = (tradeId: string, date: Date) => {
    onDeleteTrade(tradeId, date);
    toast({
      title: "Trade Deleted",
      description: "The trade has been successfully deleted."
    });
  };

  return {
    handleDayClick,
    handleAddTrade,
    handleEditTrade,
    handleEditClick,
    handleSaveReflection,
    handleSaveDailyJournal,
    handleDeleteTrade
  };
}
