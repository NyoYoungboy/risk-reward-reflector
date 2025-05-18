
import React, { createContext, useContext, useState } from "react";
import { format } from "date-fns";
import type { Trade, TradeStatistics, DailyTrades, DailyJournal } from "@/types/trade";
import type { EconomicEvents } from "@/types/economic";
import { useToast } from "@/hooks/use-toast";

interface TradeCalendarContextProps {
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

const TradeCalendarContext = createContext<TradeCalendarContextProps | undefined>(undefined);

export function TradeCalendarProvider({
  children,
  trades,
  dailyJournals,
  onAddTrade,
  onEditTrade,
  onDeleteTrade,
  onSaveDailyJournal,
  onSaveWeeklyReflection,
  economicEvents,
  calculateTradeStatistics
}: {
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
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isWeeklyReflectionOpen, setIsWeeklyReflectionOpen] = useState(false);
  const [isDailyRecapOpen, setIsDailyRecapOpen] = useState(false);
  const [isMonthlyRecapOpen, setIsMonthlyRecapOpen] = useState(false);
  const [weeklyReflection, setWeeklyReflection] = useState("");
  const [currentWeekPnL, setCurrentWeekPnL] = useState(0);
  const [currentWeekCurrency, setCurrentWeekCurrency] = useState("USD");
  const { toast } = useToast();

  const getDailyJournalContent = (dateStr: string): string => {
    const journal = dailyJournals.find(j => j.date === dateStr);
    return journal ? journal.content : "";
  };

  const calculateMonthlyStats = (date: Date) => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let monthlyTrades: Trade[] = [];

    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const dayTrades = trades[dateStr] || [];
      
      if (dayTrades.length > 0) {
        monthlyTrades = [...monthlyTrades, ...dayTrades];
      }
    }

    return { 
      monthlyTrades, 
      stats: calculateTradeStatistics(monthlyTrades)
    };
  };

  const calculateWeeklyStats = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const weekEnd = date;
    let weeklyTrades: Trade[] = [];

    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const dayTrades = trades[dateStr] || [];
      
      if (dayTrades.length > 0) {
        weeklyTrades = [...weeklyTrades, ...dayTrades];
      }
    }

    return { 
      weeklyTrades,
      stats: calculateTradeStatistics(weeklyTrades)
    };
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    
    if (date.getDate() === new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
      setIsMonthlyRecapOpen(true);
      return;
    }

    if (date.getDay() === 6) { // Saturday
      setIsDailyRecapOpen(true);
    } else if (date.getDay() === 0) { // Sunday
      setIsDailyRecapOpen(true);
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

  return (
    <TradeCalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        isDialogOpen,
        setIsDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        selectedTrade,
        setSelectedTrade,
        isWeeklyReflectionOpen,
        setIsWeeklyReflectionOpen,
        isDailyRecapOpen,
        setIsDailyRecapOpen,
        isMonthlyRecapOpen,
        setIsMonthlyRecapOpen,
        weeklyReflection,
        setWeeklyReflection,
        currentWeekPnL,
        setCurrentWeekPnL,
        currentWeekCurrency,
        setCurrentWeekCurrency,
        trades,
        dailyJournals,
        economicEvents,
        calculateTradeStatistics,
        onAddTrade,
        onEditTrade,
        onDeleteTrade,
        onSaveDailyJournal,
        onSaveWeeklyReflection,
        handleDayClick,
        handleAddTrade,
        handleEditTrade,
        handleEditClick,
        handleSaveReflection,
        handleSaveDailyJournal,
        handleDeleteTrade,
        getDailyJournalContent,
        calculateMonthlyStats,
        calculateWeeklyStats
      }}
    >
      {children}
    </TradeCalendarContext.Provider>
  );
}

export function useTradeCalendar() {
  const context = useContext(TradeCalendarContext);
  if (context === undefined) {
    throw new Error("useTradeCalendar must be used within a TradeCalendarProvider");
  }
  return context;
}
