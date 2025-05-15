
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { DailyTrades, Trade, DailyJournal } from "@/types/trade";
import type { EconomicEvents } from "@/types/economic";

export interface WeeklyReflection {
  weekEndDate: string;
  reflection: string;
  pnl: number;
  currency: string;
}

export function useTradingData(userId?: string) {
  const [trades, setTrades] = useState<DailyTrades>({});
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>([]);
  const [dailyJournals, setDailyJournals] = useState<DailyJournal[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvents>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      
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
        
        // Fetch daily journals
        const { data: journalsData, error: journalsError } = await supabase
          .from('daily_journals')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });
          
        if (journalsError) throw journalsError;
        
        const formattedJournals: DailyJournal[] = journalsData?.map(journal => ({
          id: journal.id,
          date: format(new Date(journal.date), "yyyy-MM-dd"),
          content: journal.content,
        })) || [];
        
        setDailyJournals(formattedJournals);
        
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
          
          const formattedEvent = {
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
  }, [userId]);

  return {
    trades,
    setTrades,
    weeklyReflections,
    setWeeklyReflections,
    dailyJournals,
    setDailyJournals,
    economicEvents,
    loading
  };
}
