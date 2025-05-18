
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { format, isSunday, isSaturday, addDays } from "date-fns";
import { JournalEntry } from "@/components/JournalEntry";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Edit } from "lucide-react";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";

export function DailyRecapDialog() {
  const { 
    isDailyRecapOpen, 
    setIsDailyRecapOpen,
    isWeeklyReflectionOpen,
    setIsWeeklyReflectionOpen,
    isDialogOpen,
    setIsDialogOpen,
    selectedDate,
    trades,
    economicEvents,
    handleDeleteTrade,
    handleEditClick,
    handleSaveDailyJournal,
    getDailyJournalContent
  } = useTradeCalendar();

  return (
    <Dialog open={isDailyRecapOpen} onOpenChange={setIsDailyRecapOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedDate && isSunday(selectedDate) ? (
              <>Week Ahead - Economic Events</>
            ) : (
              <>Daily Trading Journal - {selectedDate ? format(selectedDate, "PP") : ""}</>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedDate && (
            <>
              {isSunday(selectedDate) ? (
                <div className="space-y-4">
                  {(() => {
                    const nextWeekStart = selectedDate;
                    const nextWeekEnd = addDays(selectedDate, 6);
                    let hasEvents = false;

                    return (
                      <>
                        <div className="text-muted-foreground">
                          Economic events for {format(nextWeekStart, "MMM d")} - {format(nextWeekEnd, "MMM d, yyyy")}
                        </div>
                        {Array.from({ length: 7 }, (_, i) => {
                          const currentDate = addDays(nextWeekStart, i);
                          const dateStr = format(currentDate, "yyyy-MM-dd");
                          const events = economicEvents[dateStr] || [];

                          if (events.length > 0) {
                            hasEvents = true;
                            return (
                              <Card key={dateStr}>
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    {format(currentDate, "EEEE, MMMM d")}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {events.map((event) => (
                                    <div
                                      key={event.id}
                                      className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/20"
                                    >
                                      <div className="font-medium">{event.indicator}</div>
                                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                                        <div>
                                          <div className="text-muted-foreground">Previous</div>
                                          <div>{event.previous}%</div>
                                        </div>
                                        <div>
                                          <div className="text-muted-foreground">Forecast</div>
                                          <div>{event.forecast}%</div>
                                        </div>
                                        {event.actual !== undefined && (
                                          <div>
                                            <div className="text-muted-foreground">Actual</div>
                                            <div>{event.actual}%</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            );
                          }
                          return null;
                        })}
                        {!hasEvents && (
                          <div className="text-center text-muted-foreground py-8">
                            No economic events scheduled for this week
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <>
                  {/* Daily Journal Entry */}
                  <JournalEntry
                    date={selectedDate}
                    content={getDailyJournalContent(format(selectedDate, "yyyy-MM-dd"))}
                    onSave={(content) => handleSaveDailyJournal(content)}
                    title="Daily Trading Journal"
                    placeholder="Record your thoughts about the trading day. Market conditions, personal state of mind, ideas, and potential setups."
                  />
                  
                  {/* Show Weekly Reflection button on Saturday */}
                  {selectedDate && isSaturday(selectedDate) && (
                    <div className="flex justify-end mb-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsDailyRecapOpen(false);
                          setIsWeeklyReflectionOpen(true);
                        }}
                      >
                        Weekly Reflection
                      </Button>
                    </div>
                  )}
                  
                  {/* Trades List */}
                  <div className="mt-6">
                    <div className="text-lg font-medium mb-2">
                      Trades for {selectedDate && format(selectedDate, "PP")}
                    </div>
                    <div className="space-y-2">
                      {selectedDate && trades[format(selectedDate, "yyyy-MM-dd")]?.map((trade) => (
                        <div key={trade.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{trade.ticker}</span>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-bold",
                                trade.pnl > 0 ? "text-green-500" : "text-red-500"
                              )}>
                                {trade.pnl.toFixed(2)} {trade.currency}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-blue-500 hover:text-blue-600"
                                onClick={() => handleEditClick(trade)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the trade.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => selectedDate && handleDeleteTrade(trade.id, selectedDate)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div>Risk: {trade.riskR}R</div>
                            <div>Actual: {trade.actualR}R</div>
                            <div>Entry: {trade.entryReason}</div>
                            <div>Exit: {trade.exitReason}</div>
                          </div>
                        </div>
                      ))}
                      {selectedDate && (!trades[format(selectedDate, "yyyy-MM-dd")] || trades[format(selectedDate, "yyyy-MM-dd")].length === 0) && (
                        <div className="text-center text-muted-foreground py-4">
                          No trades recorded for this day
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDailyRecapOpen(false)}>
              Close
            </Button>
            {selectedDate && !isSunday(selectedDate) && (
              <Button onClick={() => {
                setIsDailyRecapOpen(false);
                setIsDialogOpen(true);
              }}>
                Add Trade
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
