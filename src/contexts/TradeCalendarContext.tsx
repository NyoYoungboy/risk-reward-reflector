
import React, { createContext, useContext, useState } from "react";
import type { Trade } from "@/types/trade";
import type { TradeCalendarContextProps, TradeCalendarProviderProps } from "./types/TradeCalendarTypes";
import { useTradeCalendarStats } from "./hooks/useTradeCalendarStats";
import { useTradeCalendarActions } from "./hooks/useTradeCalendarActions";
import { useTradeCalendarUtils } from "./hooks/useTradeCalendarUtils";

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
}: TradeCalendarProviderProps) {
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

  const { calculateMonthlyStats, calculateWeeklyStats } = useTradeCalendarStats(trades, calculateTradeStatistics);
  
  const { getDailyJournalContent } = useTradeCalendarUtils(dailyJournals);
  
  const {
    handleDayClick,
    handleAddTrade,
    handleEditTrade,
    handleEditClick,
    handleSaveReflection,
    handleSaveDailyJournal,
    handleDeleteTrade
  } = useTradeCalendarActions(
    selectedDate,
    weeklyReflection,
    currentWeekPnL,
    currentWeekCurrency,
    setIsDialogOpen,
    setIsEditDialogOpen,
    setSelectedTrade,
    setIsWeeklyReflectionOpen,
    setIsDailyRecapOpen,
    setIsMonthlyRecapOpen,
    onAddTrade,
    onEditTrade,
    onDeleteTrade,
    onSaveDailyJournal,
    onSaveWeeklyReflection
  );

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
