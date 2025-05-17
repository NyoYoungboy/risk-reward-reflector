
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
        
        // Transform database rows to Trade objects
        const transformedTrades: Trade[] = tradesData.map(row => ({
          id: row.id,
          date: new Date(row.date),
          ticker: row.ticker,
          direction: row.direction || "long", // Default to "long" if direction is not specified
          riskR: row.risk_r,
          potentialR: row.potential_r,
          rValue: row.r_value,
          currency: row.currency as "USD" | "EUR",
          outcome: row.outcome as "win" | "loss" | "breakeven",
          actualR: row.actual_r,
          pnl: row.pnl,
          entryReason: row.entry_reason || "",
          exitReason: row.exit_reason || "",
          screenshot: row.screenshot,
          reflection: {
            whatWentWrong: row.what_went_wrong || "",
            whatWentRight: row.what_went_right || "",
            followedPlan: row.followed_plan ?? true,
            emotions: {
              before: row.emotion_before || "",
              during: row.emotion_during || "",
              after: row.emotion_after || "",
            }
          }
        }));
        
        // Organize trades by date
        const organizedTrades: DailyTrades = {};
        transformedTrades.forEach(trade => {
          const dateStr = format(new Date(trade.date), "yyyy-MM-dd");
          
          if (!organizedTrades[dateStr]) {
            organizedTrades[dateStr] = [];
          }
          
          organizedTrades[dateStr].push(trade);
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
        
        // Fetch daily journals - Using 'any' type temporarily to fix the TypeScript error
        // until the Supabase types are updated after table creation
        const { data: journalsData, error: journalsError } = await supabase
          .from('daily_journals' as any)
          .select('*')
          .order('date', { ascending: false });
          
        if (journalsError) throw journalsError;
        
        // Type assertion to handle the data until Supabase types are updated
        const formattedJournals: DailyJournal[] = (journalsData as any[])?.map(journal => ({
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
