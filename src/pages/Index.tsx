
import React, { useState, useEffect } from "react";
import { TradeCalendar } from "@/components/TradeCalendar";
import type { DailyTrades, Trade } from "@/types/trade";
import type { EconomicEvent, EconomicEvents } from "@/types/economic";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface WeeklyReflection {
  weekEndDate: string;
  reflection: string;
  pnl: number;
  currency: string;
}

export default function Index() {
  const [trades, setTrades] = useState<DailyTrades>({});
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvents>({});
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch trades
        const { data: tradesData, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .order('date', { ascending: false });
          
        if (tradesError) throw tradesError;
        
        // Organize trades by date
        const organizedTrades: DailyTrades = {};
        tradesData?.forEach(trade => {
          const dateStr = format(new Date(trade.date), "yyyy-MM-dd");
          
          const formattedTrade: Trade = {
            id: trade.id,
            date: new Date(trade.date),
            ticker: trade.ticker,
            riskR: Number(trade.risk_r),
            potentialR: Number(trade.potential_r),
            rValue: Number(trade.r_value),
            currency: trade.currency as "USD" | "EUR",
            outcome: trade.outcome as "win" | "loss",
            actualR: Number(trade.actual_r),
            pnl: Number(trade.pnl),
            entryReason: trade.entry_reason || "",
            exitReason: trade.exit_reason || "",
            screenshot: trade.screenshot,
            reflection: {
              whatWentWrong: trade.what_went_wrong || "",
              whatWentRight: trade.what_went_right || "",
              followedPlan: trade.followed_plan,
              emotions: {
                before: trade.emotion_before || "",
                during: trade.emotion_during || "",
                after: trade.emotion_after || "",
              },
            },
          };
          
          if (!organizedTrades[dateStr]) {
            organizedTrades[dateStr] = [];
          }
          
          organizedTrades[dateStr].push(formattedTrade);
        });
        
        setTrades(organizedTrades);
        
        // Fetch weekly reflections
        const { data: reflectionsData, error: reflectionsError } = await supabase
          .from('weekly_reflections')
          .select('*')
          .order('week_end_date', { ascending: false });
          
        if (reflectionsError) throw reflectionsError;
        
        const formattedReflections: WeeklyReflection[] = reflectionsData?.map(reflection => ({
          weekEndDate: format(new Date(reflection.week_end_date), "yyyy-MM-dd"),
          reflection: reflection.reflection,
          pnl: Number(reflection.pnl),
          currency: reflection.currency,
        })) || [];
        
        setWeeklyReflections(formattedReflections);
        
        // Fetch economic events
        const { data: eventsData, error: eventsError } = await supabase
          .from('economic_events')
          .select('*')
          .order('date', { ascending: false });
          
        if (eventsError) throw eventsError;
        
        // Organize economic events by date
        const organizedEvents: EconomicEvents = {};
        eventsData?.forEach(event => {
          const dateStr = format(new Date(event.date), "yyyy-MM-dd");
          
          const formattedEvent: EconomicEvent = {
            id: event.id,
            date: new Date(event.date),
            indicator: event.indicator,
            actual: event.actual !== null ? Number(event.actual) : undefined,
            previous: event.previous !== null ? Number(event.previous) : undefined,
            forecast: event.forecast !== null ? Number(event.forecast) : undefined,
            currency: event.currency,
          };
          
          if (!organizedEvents[dateStr]) {
            organizedEvents[dateStr] = [];
          }
          
          organizedEvents[dateStr].push(formattedEvent);
        });
        
        setEconomicEvents(organizedEvents);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching data",
          description: error.message || "Failed to load your data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [user]);

  const handleAddTrade = async (trade: Trade) => {
    if (!user) return;
    
    try {
      // Upload screenshot to storage if present
      let screenshotUrl = trade.screenshot;
      
      if (trade.screenshot && trade.screenshot.startsWith('data:image')) {
        const file = await (await fetch(trade.screenshot)).blob();
        const fileExt = file.type.split('/')[1];
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
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
          user_id: user.id,
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

  const handleDeleteTrade = async (tradeId: string, date: Date) => {
    if (!user) return;
    
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
    if (!user) return;
    
    try {
      // Check if reflection already exists
      const { data } = await supabase
        .from('weekly_reflections')
        .select('id')
        .eq('week_end_date', reflection.weekEndDate)
        .eq('user_id', user.id)
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
            user_id: user.id,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your trading journal...</p>
        </div>
      </div>
    );
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
        onAddTrade={handleAddTrade}
        onDeleteTrade={handleDeleteTrade}
        economicEvents={economicEvents}
      />
    </>
  );
}
