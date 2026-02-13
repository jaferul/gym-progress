import {
  IconFlame,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useAuth } from "./auth-provider";

function CalorieCard({
  item,
  isAuthenticated,
  goal,
}: {
  item: { date: string; totalCalories: number };
  isAuthenticated: boolean;
  goal: number;
}) {
  const diff = item.totalCalories - goal;
  const isOver = diff > 0;
  const absDiff = Math.abs(diff);
  const percentageChange = ((diff / goal) * 100).toFixed(1);

  const date = new Date(item.date);
  const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
  const dateStr = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <Card
      className={`relative overflow-hidden rounded-2xl py-0 gap-0
        ${!isAuthenticated ? "border-dashed border-amber-300/50 dark:border-amber-500/20" : ""}
      `}
    >
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          isOver
            ? "bg-gradient-to-r from-rose-400/80 via-orange-400/80 to-amber-400/80"
            : "bg-gradient-to-r from-emerald-400/80 via-teal-400/80 to-cyan-400/80"
        }`}
      />

      <CardHeader className="px-5 pt-5 pb-0">
        {!isAuthenticated && (
          <Badge className="bg-amber-500/15 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 border-0 lg:hidden">
            Sample
          </Badge>
        )}
        <CardDescription className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider">
            {dayName}
          </span>
          <span className="text-xs text-muted-foreground/60">&middot;</span>
          <span className="text-xs">{dateStr}</span>
          {!isAuthenticated && (
            <Badge className="bg-amber-500/15 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 border-0 hidden lg:inline-flex">
              Sample
            </Badge>
          )}
        </CardDescription>
        <Badge
          variant="outline"
          className={`absolute top-5 right-5 text-[11px] font-semibold tabular-nums gap-1 ${
            isOver
              ? "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
              : "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
          }`}
        >
          {isOver ? (
            <IconTrendingUp className="!size-3" />
          ) : (
            <IconTrendingDown className="!size-3" />
          )}
          {isOver ? "+" : "-"}
          {Math.abs(Number(percentageChange))}%
        </Badge>
      </CardHeader>

      <CardContent className="px-5 pt-4 pb-0">
        <CardTitle className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums tracking-tight leading-none">
            {item.totalCalories.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            kcal
          </span>
        </CardTitle>
      </CardContent>

      <CardFooter className="px-5 pt-4 pb-5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span
            className={`font-semibold ${
              isOver
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isOver ? "+" : "-"}
            {absDiff}
          </span>{" "}
          {isOver ? "over" : "under"} goal
        </p>
        <div className="flex items-center gap-1 text-muted-foreground/50">
          <IconFlame className="size-3.5" />
          <span className="text-[11px] tabular-nums font-medium">
            {goal.toLocaleString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  const { data, isAuthenticated, goalCalories } = useAuth();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const items = data.slice(-4).reverse();
  const goal = goalCalories || 2000;

  return (
    <div className="px-4 lg:px-6">
      <div className="lg:hidden">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-3">
            {items.map((item) => (
              <CarouselItem
                key={item.date}
                className="pl-3 basis-[65%] sm:basis-[45%]"
              >
                <CalorieCard
                  item={item}
                  isAuthenticated={isAuthenticated}
                  goal={goal}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 @5xl/main:grid-cols-4 gap-3">
        {items.map((item) => (
          <CalorieCard
            key={item.date}
            item={item}
            isAuthenticated={isAuthenticated}
            goal={goal}
          />
        ))}
      </div>
    </div>
  );
}
