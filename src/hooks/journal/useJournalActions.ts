
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { DailyJournal } from "@/types/trade";

export interface WeeklyReflection {
  weekEndDate: string;
  reflection: string;
  pnl: number;
  currency: string;
}

export function useJournalActions(
  weeklyReflections: WeeklyReflection[],
  setWeeklyReflections: React.Dispatch<React.SetStateAction<WeeklyReflection[]>>,
  dailyJournals: DailyJournal[],
  setDailyJournals: React.Dispatch<React.SetStateAction<DailyJournal[]>>,
  userId?: string
) {
  const [saving, setSaving] = useState(false);
  
  const handleSaveReflection = async (reflection: WeeklyReflection) => {
    if (!userId || saving) return;
    
    try {
      setSaving(true);
      
      // Check if reflection already exists for this week
      const existingReflectionIndex = weeklyReflections.findIndex(
        r => r.weekEndDate === reflection.weekEndDate
      );
      
      let response;
      
      if (existingReflectionIndex >= 0) {
        // Update existing reflection
        const { error } = await supabase
          .from('weekly_reflections')
          .update({
            reflection: reflection.reflection,
            pnl: reflection.pnl,
            currency: reflection.currency
          })
          .eq('user_id', userId)
          .eq('week_end_date', reflection.weekEndDate);
          
        if (error) throw error;
        
        // Update local state
        const updatedReflections = [...weeklyReflections];
        updatedReflections[existingReflectionIndex] = reflection;
        setWeeklyReflections(updatedReflections);
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
        
        // Update local state
        setWeeklyReflections(prev => [reflection, ...prev]);
      }
      
      toast({
        title: "Weekly Reflection Saved",
        description: "Your weekly reflection has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving reflection:", error);
      toast({
        title: "Error Saving Reflection",
        description: error.message || "Failed to save your reflection",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDailyJournal = async (journalEntry: DailyJournal) => {
    if (!userId || saving) return;
    
    try {
      setSaving(true);
      
      // Check if journal entry already exists for this date
      const existingJournalIndex = dailyJournals.findIndex(
        j => j.date === journalEntry.date
      );
      
      let response;
      
      if (existingJournalIndex >= 0) {
        // Update existing journal entry
        const { error } = await supabase
          .from('daily_journals')
          .update({
            content: journalEntry.content
          })
          .eq('id', journalEntry.id);
          
        if (error) throw error;
        
        // Update local state
        const updatedJournals = [...dailyJournals];
        updatedJournals[existingJournalIndex] = journalEntry;
        setDailyJournals(updatedJournals);
      } else {
        // Insert new journal entry
        const { data, error } = await supabase
          .from('daily_journals')
          .insert({
            user_id: userId,
            date: journalEntry.date,
            content: journalEntry.content
          })
          .select('id');
          
        if (error) throw error;
        
        // Add id from response to journal entry
        const newJournalEntry = {
          ...journalEntry,
          id: data[0]?.id || journalEntry.id
        };
        
        // Update local state
        setDailyJournals(prev => [newJournalEntry, ...prev]);
      }
      
      toast({
        title: "Journal Entry Saved",
        description: "Your journal entry has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Error Saving Journal Entry",
        description: error.message || "Failed to save your journal entry",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    handleSaveReflection,
    handleSaveDailyJournal,
  };
}
