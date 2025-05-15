
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { DailyTrades, Trade } from "@/types/trade";
import { format } from "date-fns";
import { useOfflineAware } from "../useOfflineAware";
import { storeTradeOffline } from "@/utils/offlineStorage";

export function useTradeActions(
  trades: DailyTrades,
  setTrades: React.Dispatch<React.SetStateAction<DailyTrades>>,
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
          direction: trade.direction, // Add direction field
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
          direction: trade.direction, // Add direction field
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

  return { 
    handleAddTrade, 
    handleEditTrade,
    handleDeleteTrade
  };
}
