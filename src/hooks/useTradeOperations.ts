
import { useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { DailyTrades, Trade, TradeStatistics, DailyJournal } from "@/types/trade";
import { useOfflineAware } from "./useOfflineAware";
import { storeTradeOffline } from "@/utils/offlineStorage";
import type { WeeklyReflection } from "./useTradingData";

export function useTradeOperations(
  trades: DailyTrades,
  setTrades: React.Dispatch<React.SetStateAction<DailyTrades>>,
  weeklyReflections: WeeklyReflection[],
  setWeeklyReflections: React.Dispatch<React.SetStateAction<WeeklyReflection[]>>,
  dailyJournals: DailyJournal[],
  setDailyJournals: React.Dispatch<React.SetStateAction<DailyJournal[]>>,
  userId?: string
) {
  const { isOnline } = useOfflineAware();
  
  const handleAddTrade = async (trade: Trade) => {
    if (!userId) return;
    
    try {
      if (!isOnline) {
        // Store trade offline
        await storeTradeOffline(trade);
        
        // Update local state
        const dateStr = format(trade.date, "yyyy-MM-dd");
        setTrades((prev) => ({
          ...prev,
          [dateStr]: [...(prev[dateStr] || []), trade],
        }));
        
        toast({
          title: "Trade Saved Offline",
          description: "The trade will be synchronized when you're back online.",
        });
        
        return;
      }
      
      // Upload screenshot to storage if present
      let screenshotUrl = trade.screenshot;
      
      if (trade.screenshot && trade.screenshot.startsWith('data:image')) {
        const file = await (await fetch(trade.screenshot)).blob();
        const fileExt = file.type.split('/')[1];
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase
          .storage
          .from('trade-screenshots')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase
          .storage
          .from('trade-screenshots')
          .getPublicUrl(fileName);
          
        screenshotUrl = publicUrl;
      }
      
      // Insert trade into database
      const { error } = await supabase
        .from('trades')
        .insert({
          user_id: userId,
          date: trade.date.toISOString(),
          ticker: trade.ticker,
          risk_r: trade.riskR,
          potential_r: trade.potentialR,
          r_value: trade.rValue,
          currency: trade.currency,
          outcome: trade.outcome,
          actual_r: trade.actualR,
          pnl: trade.pnl,
          entry_reason: trade.entryReason,
          exit_reason: trade.exitReason,
          screenshot: screenshotUrl,
          what_went_wrong: trade.reflection.whatWentWrong,
          what_went_right: trade.reflection.whatWentRight,
          followed_plan: trade.reflection.followedPlan,
          emotion_before: trade.reflection.emotions.before,
          emotion_during: trade.reflection.emotions.during,
          emotion_after: trade.reflection.emotions.after
        });
        
      if (error) throw error;
      
      // Update local state
      const dateStr = format(trade.date, "yyyy-MM-dd");
      setTrades((prev) => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), { ...trade, screenshot: screenshotUrl }],
      }));
      
      toast({
        title: "Trade Added",
        description: `${trade.ticker} trade was successfully added${trade.screenshot ? " with screenshot" : ""}`,
      });
    } catch (error: any) {
      console.error("Error adding trade:", error);
      toast({
        title: "Error adding trade",
        description: error.message || "Failed to save the trade",
        variant: "destructive",
      });
    }
  };

  const handleEditTrade = async (trade: Trade) => {
    if (!userId) return;
    
    try {
      // Upload screenshot to storage if present and it's a new data URL
      let screenshotUrl = trade.screenshot;
      
      if (trade.screenshot && trade.screenshot.startsWith('data:image')) {
        const file = await (await fetch(trade.screenshot)).blob();
        const fileExt = file.type.split('/')[1];
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase
          .storage
          .from('trade-screenshots')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase
          .storage
          .from('trade-screenshots')
          .getPublicUrl(fileName);
          
        screenshotUrl = publicUrl;
      }
      
      // Update trade in database
      const { error } = await supabase
        .from('trades')
        .update({
          ticker: trade.ticker,
          risk_r: trade.riskR,
          potential_r: trade.potentialR,
          r_value: trade.rValue,
          currency: trade.currency,
          outcome: trade.outcome,
          actual_r: trade.actualR,
          pnl: trade.pnl,
          entry_reason: trade.entryReason,
          exit_reason: trade.exitReason,
          screenshot: screenshotUrl,
          what_went_wrong: trade.reflection.whatWentWrong,
          what_went_right: trade.reflection.whatWentRight,
          followed_plan: trade.reflection.followedPlan,
          emotion_before: trade.reflection.emotions.before,
          emotion_during: trade.reflection.emotions.during,
          emotion_after: trade.reflection.emotions.after
        })
        .eq('id', trade.id);
        
      if (error) throw error;
      
      // Update local state
      const dateStr = format(trade.date, "yyyy-MM-dd");
      setTrades((prev) => {
        const updatedDailyTrades = { ...prev };
        if (updatedDailyTrades[dateStr]) {
          updatedDailyTrades[dateStr] = updatedDailyTrades[dateStr].map(t => 
            t.id === trade.id ? { ...trade, screenshot: screenshotUrl } : t
          );
        }
        return updatedDailyTrades;
      });
      
      toast({
        title: "Trade Updated",
        description: `${trade.ticker} trade was successfully updated`,
      });
    } catch (error: any) {
      console.error("Error updating trade:", error);
      toast({
        title: "Error updating trade",
        description: error.message || "Failed to update the trade",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTrade = async (tradeId: string, date: Date) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeId);
        
      if (error) throw error;
      
      // Update local state
      const dateStr = format(date, "yyyy-MM-dd");
      setTrades((prev) => ({
        ...prev,
        [dateStr]: prev[dateStr].filter((trade) => trade.id !== tradeId),
      }));
      
      toast({
        title: "Trade Deleted",
        description: "The trade was successfully removed",
      });
    } catch (error: any) {
      console.error("Error deleting trade:", error);
      toast({
        title: "Error deleting trade",
        description: error.message || "Failed to delete the trade",
        variant: "destructive",
      });
    }
  };

  const handleSaveReflection = async (reflection: WeeklyReflection) => {
    if (!userId) return;
    
    try {
      // Check if reflection already exists
      const { data } = await supabase
        .from('weekly_reflections')
        .select('id')
        .eq('week_end_date', reflection.weekEndDate)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (data?.id) {
        // Update existing reflection
        const { error } = await supabase
          .from('weekly_reflections')
          .update({
            reflection: reflection.reflection,
            pnl: reflection.pnl,
            currency: reflection.currency
          })
          .eq('id', data.id);
          
        if (error) throw error;
      } else {
        // Insert new reflection
        const { error } = await supabase
          .from('weekly_reflections')
          .insert({
            user_id: userId,
            week_end_date: reflection.weekEndDate,
            reflection: reflection.reflection,
            pnl: reflection.pnl,
            currency: reflection.currency
          });
          
        if (error) throw error;
      }
      
      // Update local state
      const existingIndex = weeklyReflections.findIndex(
        (r) => r.weekEndDate === reflection.weekEndDate
      );
      
      if (existingIndex >= 0) {
        const updatedReflections = [...weeklyReflections];
        updatedReflections[existingIndex] = reflection;
        setWeeklyReflections(updatedReflections);
      } else {
        setWeeklyReflections([...weeklyReflections, reflection]);
      }
      
      toast({
        title: "Reflection Saved",
        description: "Your weekly reflection was saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving reflection:", error);
      toast({
        title: "Error saving reflection",
        description: error.message || "Failed to save the reflection",
        variant: "destructive",
      });
    }
  };

  const handleSaveDailyJournal = async (dateStr: string, content: string) => {
    if (!userId) return;
    
    try {
      // Check if journal entry already exists
      const existingEntry = dailyJournals.find(journal => journal.date === dateStr);
      
      if (existingEntry) {
        // Update existing journal using type assertions to bypass TypeScript errors
        // until the Supabase types are updated after table creation
        const { error } = await supabase
          .from('daily_journals' as any)
          .update({ 
            content 
          })
          .eq('id', existingEntry.id);
          
        if (error) throw error;
        
        // Update local state
        setDailyJournals(prev => 
          prev.map(journal => 
            journal.id === existingEntry.id 
              ? { ...journal, content } 
              : journal
          )
        );
      } else {
        // Insert new journal using type assertions to bypass TypeScript errors
        const { data, error } = await supabase
          .from('daily_journals' as any)
          .insert({
            user_id: userId,
            date: dateStr,
            content
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        // Update local state
        setDailyJournals(prev => [
          ...prev, 
          { id: data.id, date: dateStr, content }
        ]);
      }
      
      toast({
        title: "Journal Saved",
        description: "Your journal entry was saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving journal:", error);
      toast({
        title: "Error saving journal",
        description: error.message || "Failed to save the journal",
        variant: "destructive",
      });
    }
  };

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

  return { 
    handleAddTrade, 
    handleEditTrade,
    handleDeleteTrade, 
    handleSaveReflection,
    handleSaveDailyJournal,
    calculateTradeStatistics
  };
}
