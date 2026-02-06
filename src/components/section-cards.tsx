import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "./auth-provider";

export function SectionCards() {
  const { data, isAuthenticated, goalCalories } = useAuth();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {data?.slice(-4)?.map((item, index) => {
        const diff = item.totalCalories - (goalCalories || 0);
        const isUp = diff > 0;
        const percentageChange = ((diff / (goalCalories || 1)) * 100).toFixed(
          1,
        );

        return (
          <Card
            key={index}
            className={`@container/card relative ${!isAuthenticated ? "border-dashed border-amber-300/50 dark:border-amber-500/20" : ""}`}
          >
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                Total Calories
                {!isAuthenticated && (
                  <Badge className="bg-amber-500/15 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                    Sample
                  </Badge>
                )}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {item.totalCalories}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {isUp ? <IconTrendingUp /> : <IconTrendingDown />}
                  {`${isUp ? "+" : "-"}${Math.abs(Number(percentageChange))}%`}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {new Date(item.date).toLocaleDateString("en-GB")}
              </div>
              <div className="text-muted-foreground">
                You are{" "}
                <span className="underline font-bold text-foreground">
                  {isUp ? "up" : "down"} {Math.abs(diff)}
                </span>{" "}
                calories from the goal
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
