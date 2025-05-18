
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { TradeStatisticsSummary } from "@/components/TradeStatistics";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, Edit } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTradeCalendar } from "@/contexts/TradeCalendarContext";

export function MonthlyRecapDialog() {
  const { 
    isMonthlyRecapOpen, 
    setIsMonthlyRecapOpen,
    selectedDate,
    calculateMonthlyStats,
    handleDeleteTrade,
    handleEditClick
  } = useTradeCalendar();

  return (
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
                              handleEditClick(trade);
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
  );
}
