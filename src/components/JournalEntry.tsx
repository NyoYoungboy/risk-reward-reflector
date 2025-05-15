
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface JournalEntryProps {
  date: Date;
  content: string;
  onSave: (content: string) => void;
  title: string;
  placeholder: string;
}

export function JournalEntry({ date, content, onSave, title, placeholder }: JournalEntryProps) {
  const [journalContent, setJournalContent] = React.useState(content);

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">
        {title} - {format(date, "PP")}
      </div>
      <Textarea
        placeholder={placeholder}
        value={journalContent}
        onChange={(e) => setJournalContent(e.target.value)}
        className="min-h-[300px]"
      />
      <div className="flex justify-end">
        <Button onClick={() => onSave(journalContent)}>Save Journal</Button>
      </div>
    </div>
  );
}
