
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
      <CardContent className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
