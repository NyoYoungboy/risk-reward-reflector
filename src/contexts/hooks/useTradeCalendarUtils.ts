
import type { DailyJournal } from "@/types/trade";

export function useTradeCalendarUtils(dailyJournals: DailyJournal[]) {
  const getDailyJournalContent = (dateStr: string): string => {
    const journal = dailyJournals.find(j => j.date === dateStr);
    return journal ? journal.content : "";
  };

  return {
    getDailyJournalContent
  };
}
