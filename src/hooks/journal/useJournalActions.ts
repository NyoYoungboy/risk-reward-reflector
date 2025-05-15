
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { DailyJournal } from "@/types/trade";
import type { WeeklyReflection } from "../useTradingData";

export function useJournalActions(
  weeklyReflections: WeeklyReflection[],
  setWeeklyReflections: React.Dispatch<React.SetStateAction<WeeklyReflection[]>>,
  dailyJournals: DailyJournal[],
  setDailyJournals: React.Dispatch<React.SetStateAction<DailyJournal[]>>,
  userId?: string
) {
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

  return {
    handleSaveReflection,
    handleSaveDailyJournal
  };
}
