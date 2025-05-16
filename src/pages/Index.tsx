
import React from "react";
import { TradeCalendar } from "@/components/TradeCalendar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTradingData } from "@/hooks/useTradingData";
import { useTradeOperations } from "@/hooks/useTradeOperations";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DailyJournal } from "@/types/trade";

export default function Index() {
  const { user, signOut } = useAuth();
  
  const {
    trades,
    setTrades,
    weeklyReflections,
    setWeeklyReflections,
    dailyJournals,
    setDailyJournals,
    economicEvents,
    loading
  } = useTradingData(user?.id);
  
  const {
    handleAddTrade,
    handleEditTrade,
    handleDeleteTrade,
    handleSaveReflection,
    handleSaveDailyJournal,
    calculateTradeStatistics
  } = useTradeOperations(trades, setTrades, weeklyReflections, setWeeklyReflections, dailyJournals, setDailyJournals, user?.id);

  // Create adapter function to match the expected signature
  const handleSaveDailyJournalAdapter = (dateStr: string, content: string) => {
    const journal: DailyJournal = {
      id: Date.now().toString(),
      date: dateStr,
      content
    };
    handleSaveDailyJournal(journal);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex justify-end p-4">
        <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
      <TradeCalendar 
        trades={trades} 
        dailyJournals={dailyJournals}
        onAddTrade={handleAddTrade}
        onEditTrade={handleEditTrade}
        onDeleteTrade={handleDeleteTrade}
        onSaveDailyJournal={handleSaveDailyJournalAdapter}
        onSaveWeeklyReflection={handleSaveReflection}
        economicEvents={economicEvents}
        calculateTradeStatistics={calculateTradeStatistics}
      />
    </>
  );
}
