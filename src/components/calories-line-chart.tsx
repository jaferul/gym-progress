import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { useAuth } from "./auth-provider";
import { NoDataDisplay } from "./no-data-display";

const chartConfig = {
  totalCalories: {
    label: "Total Calories",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CaloriesLineChart() {
  const [timeRange, setTimeRange] = useState("90");
  const { data, goalCalories } = useAuth();

  const chartData = data.slice(-Number(timeRange));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Calories</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Calories compared to your goal
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          className="h-[250px] w-full aspect-auto"
          config={chartConfig}
        >
          {chartData && chartData.length > 0 ? (
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              {goalCalories && (
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[goalCalories - 600, goalCalories + 600]}
                />
              )}
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <ReferenceLine
                y={goalCalories}
                stroke="var(--chart-1)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line
                dataKey="totalCalories"
                type="monotone"
                stroke="var(--color-totalCalories)"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                }}
                dot={{
                  fill: "var(--color-totalCalories)",
                }}
              />
            </LineChart>
          ) : (
            <NoDataDisplay />
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Daily calorie intake tracking
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Goal set at {goalCalories} kcal
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
