
import React from "react";
import { TradeCalendar } from "@/components/TradeCalendar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTradingData } from "@/hooks/useTradingData";
import { useTradeOperations } from "@/hooks/useTradeOperations";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
        onSaveDailyJournal={handleSaveDailyJournal}
        onSaveWeeklyReflection={handleSaveReflection}
        economicEvents={economicEvents}
        calculateTradeStatistics={calculateTradeStatistics}
      />
    </>
  );
}
