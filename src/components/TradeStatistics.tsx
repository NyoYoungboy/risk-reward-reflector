
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TradeStatistics } from "@/types/trade";

interface TradeStatisticsProps {
  stats: TradeStatistics;
  title: string;
}

export function TradeStatisticsSummary({ stats, title }: TradeStatisticsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Statistics */}
        <div>
          <h3 className="text-sm font-medium mb-2">Overall</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-xl font-bold">
                {(stats.winRate * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total P&L</div>
              <div className={cn(
                "text-xl font-bold",
                stats.totalPnl > 0 ? "text-green-500" : "text-red-500"
              )}>
                {stats.totalPnl.toFixed(2)} {stats.currency}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <div className="text-sm text-muted-foreground">Winning Trades</div>
              <div className="text-lg font-medium text-green-500">
                {stats.winCount}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Losing Trades</div>
              <div className="text-lg font-medium text-red-500">
                {stats.lossCount}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Breakeven</div>
              <div className="text-lg font-medium text-gray-500">
                {/* Calculate breakeven count from total trades */}
                {stats.longStats.count + stats.shortStats.count - stats.winCount - stats.lossCount}
              </div>
            </div>
          </div>
        </div>

        {/* Long Positions Statistics */}
        <div>
          <h3 className="text-sm font-medium mb-2">Long Positions</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Count</div>
              <div className="font-medium">{stats.longStats.count}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Win Rate</div>
              <div className="font-medium">
                {stats.longStats.count > 0 
                  ? (stats.longStats.winRate * 100).toFixed(1) + "%" 
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">P&L</div>
              <div className={cn(
                "font-medium",
                stats.longStats.totalPnl > 0 ? "text-green-500" : "text-red-500"
              )}>
                {stats.longStats.totalPnl.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-1">
            <div>
              <div className="text-muted-foreground">Wins</div>
              <div className="text-green-500">{stats.longStats.winCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Losses</div>
              <div className="text-red-500">{stats.longStats.lossCount}</div>
            </div>
          </div>
        </div>

        {/* Short Positions Statistics */}
        <div>
          <h3 className="text-sm font-medium mb-2">Short Positions</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Count</div>
              <div className="font-medium">{stats.shortStats.count}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Win Rate</div>
              <div className="font-medium">
                {stats.shortStats.count > 0 
                  ? (stats.shortStats.winRate * 100).toFixed(1) + "%" 
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">P&L</div>
              <div className={cn(
                "font-medium",
                stats.shortStats.totalPnl > 0 ? "text-green-500" : "text-red-500"
              )}>
                {stats.shortStats.totalPnl.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-1">
            <div>
              <div className="text-muted-foreground">Wins</div>
              <div className="text-green-500">{stats.shortStats.winCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Losses</div>
              <div className="text-red-500">{stats.shortStats.lossCount}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
