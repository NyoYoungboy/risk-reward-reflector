import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, isSaturday, isSunday, isLastDayOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";
import type { EconomicEvents } from "@/types/economic";
import type { DailyTrades, Trade, TradeStatistics, DailyJournal } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChartLine, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TradeForm } from "@/components/TradeForm";
import { TradeEditForm } from "@/components/TradeEditForm";
import { JournalEntry } from "@/components/JournalEntry";
import { TradeStatisticsSummary } from "@/components/TradeStatistics";

interface TradeCalendarProps {
  trades: DailyTrades;
  dailyJournals: DailyJournal[];
  onAddTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string, date: Date) => void;
  onSaveDailyJournal: (dateStr: string, content: string) => void;
  onSaveWeeklyReflection: (reflection: { weekEndDate: string; reflection: string; pnl: number; currency: string; }) => void;
  economicEvents: EconomicEvents;
  calculateTradeStatistics: (trades: Trade[]) => TradeStatistics;
}

export function TradeCalendar({ 
  trades,
  dailyJournals, 
  onAddTrade, 
  onEditTrade,
  onDeleteTrade, 
  onSaveDailyJournal,
  onSaveWeeklyReflection,
  economicEvents,
  calculateTradeStatistics
}: TradeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isWeeklyReflectionOpen, setIsWeeklyReflectionOpen] = useState(false);
  const [isDailyRecapOpen, setIsDailyRecapOpen] = useState(false);
  const [isMonthlyRecapOpen, setIsMonthlyRecapOpen] = useState(false);
  const [weeklyReflection, setWeeklyReflection] = useState("");
  const [currentWeekPnL, setCurrentWeekPnL] = useState(0);
  const [currentWeekCurrency, setCurrentWeekCurrency] = useState("USD");
  const { toast } = useToast();

  const getDailyJournalContent = (dateStr: string): string => {
    const journal = dailyJournals.find(j => j.date === dateStr);
    return journal ? journal.content : "";
  };

  const calculateMonthlyStats = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    let monthlyTrades: Trade[] = [];

    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const dayTrades = trades[dateStr] || [];
      
      if (dayTrades.length > 0) {
        monthlyTrades = [...monthlyTrades, ...dayTrades];
      }
    }

    return { 
      monthlyTrades, 
      stats: calculateTradeStatistics(monthlyTrades)
    };
  };

  const calculateWeeklyStats = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = date;
    let weeklyTrades: Trade[] = [];

    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const dayTrades = trades[dateStr] || [];
      
      if (dayTrades.length > 0) {
        weeklyTrades = [...weeklyTrades, ...dayTrades];
      }
    }

    return { 
      weeklyTrades,
      stats: calculateTradeStatistics(weeklyTrades)
    };
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    
    if (isLastDayOfMonth(date)) {
      setIsMonthlyRecapOpen(true);
      return;
    }

    if (isSaturday(date)) {
      // First show the daily recap so user can see their trades
      setIsDailyRecapOpen(true);
      
      // We'll keep the weekly reflection as a separate option they can access
      // via a button in the daily recap dialog
    } else if (isSunday(date)) {
      setIsDailyRecapOpen(true);
    } else {
      setIsDailyRecapOpen(true);
    }
  };

  const handleAddTrade = (trade: Trade) => {
    onAddTrade(trade);
    setIsDialogOpen(false);
  };

  const handleEditTrade = (trade: Trade) => {
    onEditTrade(trade);
    setIsEditDialogOpen(false);
    setSelectedTrade(null);
  };

  const handleEditClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsEditDialogOpen(true);
  };

  const handleSaveReflection = () => {
    if (!selectedDate) return;
    
    const weekEndDate = format(selectedDate, "yyyy-MM-dd");
    onSaveWeeklyReflection({
      weekEndDate,
      reflection: weeklyReflection,
      pnl: currentWeekPnL,
      currency: currentWeekCurrency
    });
    
    setIsWeeklyReflectionOpen(false);
  };

  const handleSaveDailyJournal = (content: string) => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    onSaveDailyJournal(dateStr, content);
  };

  const handleDeleteTrade = (tradeId: string, date: Date) => {
    onDeleteTrade(tradeId, date);
    toast({
      title: "Trade Deleted",
      description: "The trade has been successfully deleted."
    });
  };

  const getDayContent = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayTrades = trades[dateStr] || [];
    const dayEvents = economicEvents[dateStr] || [];
    const hasJournal = dailyJournals.some(j => j.date === dateStr);
    
    if (isLastDayOfMonth(day)) {
      // ... keep existing code (month end display)
      const { stats } = calculateMonthlyStats(day);
      return (
        <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(day)}>
          <div className="text-xs font-medium text-purple-500">Month End</div>
          <div className={cn(
            "text-xs font-medium",
            stats.totalPnl > 0 ? "text-green-500" : "text-red-500"
          )}>
            {stats.totalPnl.toFixed(2)} {stats.currency}
          </div>
          <div className="text-xs text-muted-foreground">
            Win rate: {(stats.winRate * 100).toFixed(0)}%
          </div>
          {dayEvents.length > 0 && (
            <div className="mt-1">
              <ChartLine className="h-4 w-4 text-blue-500" />
            </div>
          )}
        </div>
      );
    }

    if (isSaturday(day)) {
      // Show only weekly summary info on Saturday - no trades
      const { stats } = calculateWeeklyStats(day);
      
      return (
        <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(day)}>
          <div className="text-xs font-medium text-violet-500">
            Weekly Summary
          </div>
          <div className={cn(
            "text-xs font-medium",
            stats.totalPnl > 0 ? "text-green-500" : "text-red-500"
          )}>
            {stats.totalPnl.toFixed(2)} {stats.currency}
          </div>
          {hasJournal && (
            <div className="text-xs font-medium text-amber-500">
              Journal
            </div>
          )}
        </div>
      );
    }

    if (isSunday(day)) {
      const nextWeekStart = day;
      const nextWeekEnd = addDays(day, 6);
      let upcomingEventsCount = 0;

      for (let d = new Date(nextWeekStart); d <= nextWeekEnd; d.setDate(d.getDate() + 1)) {
        const nextDateStr = format(d, "yyyy-MM-dd");
        if (economicEvents[nextDateStr]) {
          upcomingEventsCount += economicEvents[nextDateStr].length;
        }
      }

      return (
        <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(day)}>
          <div className="text-xs font-medium text-blue-500">
            Week Ahead
          </div>
          {upcomingEventsCount > 0 && (
            <div className="text-xs text-muted-foreground">
              {upcomingEventsCount} economic event{upcomingEventsCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      );
    }
    
    // Show indicator for days with journal entries
    const elements = [];
    
    if (dayTrades.length > 0) {
      const totalPnL = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      const isProfit = totalPnL > 0;

      elements.push(
        <React.Fragment key="trades">
          <div className={cn(
            "text-xs font-medium",
            isProfit ? "text-green-500" : "text-red-500"
          )}>
            {totalPnL.toFixed(2)} {dayTrades[0].currency}
          </div>
          <div className="text-xs text-muted-foreground">
            {dayTrades.length} trade{dayTrades.length > 1 ? "s" : ""}
          </div>
        </React.Fragment>
      );
    }
    
    if (hasJournal) {
      elements.push(
        <div key="journal" className="text-xs font-medium text-amber-500">
          Journal
        </div>
      );
    }
    
    if (dayEvents.length > 0) {
      elements.push(
        <div key="events" className="mt-1 flex items-center">
          <ChartLine className="h-4 w-4 text-blue-500" />
        </div>
      );
    }
    
    if (elements.length > 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => handleDayClick(day)}>
          {elements}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Journal</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Trade
        </Button>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDayClick}
        weekStartsOn={1}
        className="rounded-md border w-full max-w-4xl mx-auto bg-white dark:bg-black"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center text-lg font-bold h-16",
          caption_label: "text-base font-medium",
          nav: "space-x-1 flex items-center h-16",
          nav_button: cn(
            "h-16 w-16 bg-transparent p-0 opacity-75 hover:opacity-100 text-lg"
          ),
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full",
          head_cell: "text-primary font-semibold rounded-md w-full font-normal text-sm px-0 py-2",
          row: "flex w-full mt-2",
          cell: "h-24 w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            "h-24 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground text-lg"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        components={{
          DayContent: ({ date }) => (
            <div className="h-full w-full flex flex-col p-2">
              <span className="text-lg font-medium mb-1">{format(date, "d")}</span>
              {getDayContent(date)}
            </div>
          ),
        }}
      />

      {/* Add Trade Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add Trade for {selectedDate ? format(selectedDate, "PP") : "Today"}
            </DialogTitle>
          </DialogHeader>
          <TradeForm
            onSubmit={handleAddTrade}
            onCancel={() => setIsDialogOpen(false)}
            defaultDate={selectedDate}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Trade Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Trade
            </DialogTitle>
          </DialogHeader>
          {selectedTrade && (
            <TradeEditForm
              onSubmit={handleEditTrade}
              onCancel={() => setIsEditDialogOpen(false)}
              trade={selectedTrade}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Weekly Reflection Dialog */}
      <Dialog open={isWeeklyReflectionOpen} onOpenChange={setIsWeeklyReflectionOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Weekly Reflection - Week ending {selectedDate ? format(selectedDate, "PP") : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDate && (
              <>
                <TradeStatisticsSummary 
                  stats={calculateWeeklyStats(selectedDate).stats} 
                  title="Weekly Performance"
                />
                
                <JournalEntry
                  date={selectedDate}
                  content={weeklyReflection}
                  onSave={(content) => {
                    setWeeklyReflection(content);
                    handleSaveReflection();
                  }}
                  title="Weekly Reflection"
                  placeholder="Reflect on your trading week. What went well? What could be improved? Any patterns you noticed?"
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Recap Dialog */}
      <Dialog open={isDailyRecapOpen} onOpenChange={setIsDailyRecapOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isSunday(selectedDate as Date) ? (
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
                  // ... keep existing code for Sunday view
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
                    {isSaturday(selectedDate) && (
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
                        Trades for {format(selectedDate, "PP")}
                      </div>
                      <div className="space-y-2">
                        {trades[format(selectedDate, "yyyy-MM-dd")]?.map((trade) => (
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
                                        onClick={() => handleDeleteTrade(trade.id, selectedDate)}
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
                        {(!trades[format(selectedDate, "yyyy-MM-dd")] || trades[format(selectedDate, "yyyy-MM-dd")].length === 0) && (
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
              {!isSunday(selectedDate as Date) && (
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

      {/* Monthly Recap Dialog - Added trade deletion functionality */}
      <Dialog open={isMonthlyRecapOpen} onOpenChange={setIsMonthlyRecapOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Monthly Trading Recap - {selectedDate ? format(selectedDate, "MMMM yyyy") : ""}
            </DialogTitle>
            <DialogDescription>
              Review your trading performance for the entire month
            </DialogDescription>
          </DialogHeader>
          {selectedDate && (
            <div className="space-y-6">
              <TradeStatisticsSummary
                stats={calculateMonthlyStats(selectedDate).stats}
                title="Monthly Overview"
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">All Trades This Month</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Ticker</TableHead>
                      <TableHead>Risk (R)</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Actual R</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculateMonthlyStats(selectedDate).monthlyTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{format(trade.date, "MMM d")}</TableCell>
                        <TableCell>{trade.ticker}</TableCell>
                        <TableCell>{trade.riskR}</TableCell>
                        <TableCell>{trade.outcome}</TableCell>
                        <TableCell>{trade.actualR}</TableCell>
                        <TableCell className={cn(
                          "font-medium",
                          trade.pnl > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {trade.pnl.toFixed(2)} {trade.currency}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-blue-500 hover:text-blue-600"
                              onClick={() => {
                                setSelectedTrade(trade);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this {trade.ticker} trade? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => handleDeleteTrade(trade.id, trade.date)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
