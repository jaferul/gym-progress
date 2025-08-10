import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { useMemo, useState } from "react";

const goalCalories = 2000;

const data = [
  { date: "2025-05-13", goal: 2000, actual: 1866 },
  { date: "2025-05-14", goal: 2000, actual: 1992 },
  { date: "2025-05-15", goal: 2000, actual: 1853 },
  { date: "2025-05-16", goal: 2000, actual: 2191 },
  { date: "2025-05-17", goal: 2000, actual: 2044 },
  { date: "2025-05-18", goal: 2000, actual: 2025 },
  { date: "2025-05-19", goal: 2000, actual: 2155 },
  { date: "2025-05-20", goal: 2000, actual: 1923 },
  { date: "2025-05-21", goal: 2000, actual: 1893 },
  { date: "2025-05-22", goal: 2000, actual: 1986 },
  { date: "2025-05-23", goal: 2000, actual: 1926 },
  { date: "2025-05-24", goal: 2000, actual: 1984 },
  { date: "2025-05-25", goal: 2000, actual: 2180 },
  { date: "2025-05-26", goal: 2000, actual: 2144 },
  { date: "2025-05-27", goal: 2000, actual: 1838 },
  { date: "2025-05-28", goal: 2000, actual: 2136 },
  { date: "2025-05-29", goal: 2000, actual: 2195 },
  { date: "2025-05-30", goal: 2000, actual: 1947 },
  { date: "2025-05-31", goal: 2000, actual: 2066 },
  { date: "2025-06-01", goal: 2000, actual: 2121 },
  { date: "2025-06-02", goal: 2000, actual: 1927 },
  { date: "2025-06-03", goal: 2000, actual: 1867 },
  { date: "2025-06-04", goal: 2000, actual: 1813 },
  { date: "2025-06-05", goal: 2000, actual: 1928 },
  { date: "2025-06-06", goal: 2000, actual: 2111 },
  { date: "2025-06-07", goal: 2000, actual: 1842 },
  { date: "2025-06-08", goal: 2000, actual: 2108 },
  { date: "2025-06-09", goal: 2000, actual: 1861 },
  { date: "2025-06-10", goal: 2000, actual: 2103 },
  { date: "2025-06-11", goal: 2000, actual: 1923 },
  { date: "2025-06-12", goal: 2000, actual: 2028 },
  { date: "2025-06-13", goal: 2000, actual: 1882 },
  { date: "2025-06-14", goal: 2000, actual: 1836 },
  { date: "2025-06-15", goal: 2000, actual: 2083 },
  { date: "2025-06-16", goal: 2000, actual: 1989 },
  { date: "2025-06-17", goal: 2000, actual: 1893 },
  { date: "2025-06-18", goal: 2000, actual: 1979 },
  { date: "2025-06-19", goal: 2000, actual: 1829 },
  { date: "2025-06-20", goal: 2000, actual: 1837 },
  { date: "2025-06-21", goal: 2000, actual: 2068 },
  { date: "2025-06-22", goal: 2000, actual: 2093 },
  { date: "2025-06-23", goal: 2000, actual: 1941 },
  { date: "2025-06-24", goal: 2000, actual: 2184 },
  { date: "2025-06-25", goal: 2000, actual: 2002 },
  { date: "2025-06-26", goal: 2000, actual: 2197 },
  { date: "2025-06-27", goal: 2000, actual: 2040 },
  { date: "2025-06-28", goal: 2000, actual: 1961 },
  { date: "2025-06-29", goal: 2000, actual: 1983 },
  { date: "2025-06-30", goal: 2000, actual: 2065 },
  { date: "2025-07-01", goal: 2000, actual: 2167 },
  { date: "2025-07-02", goal: 2000, actual: 2017 },
  { date: "2025-07-03", goal: 2000, actual: 2018 },
  { date: "2025-07-04", goal: 2000, actual: 1835 },
  { date: "2025-07-05", goal: 2000, actual: 2043 },
  { date: "2025-07-06", goal: 2000, actual: 1873 },
  { date: "2025-07-07", goal: 2000, actual: 1879 },
  { date: "2025-07-08", goal: 2000, actual: 1992 },
  { date: "2025-07-09", goal: 2000, actual: 2081 },
  { date: "2025-07-10", goal: 2000, actual: 2192 },
  { date: "2025-07-11", goal: 2000, actual: 1993 },
  { date: "2025-07-12", goal: 2000, actual: 1979 },
  { date: "2025-07-13", goal: 2000, actual: 1820 },
  { date: "2025-07-14", goal: 2000, actual: 2052 },
  { date: "2025-07-15", goal: 2000, actual: 1862 },
  { date: "2025-07-16", goal: 2000, actual: 1813 },
  { date: "2025-07-17", goal: 2000, actual: 2172 },
  { date: "2025-07-18", goal: 2000, actual: 2097 },
  { date: "2025-07-19", goal: 2000, actual: 2029 },
  { date: "2025-07-20", goal: 2000, actual: 2118 },
  { date: "2025-07-21", goal: 2000, actual: 1900 },
  { date: "2025-07-22", goal: 2000, actual: 2097 },
  { date: "2025-07-23", goal: 2000, actual: 1868 },
  { date: "2025-07-24", goal: 2000, actual: 2175 },
  { date: "2025-07-25", goal: 2000, actual: 2062 },
  { date: "2025-07-26", goal: 2000, actual: 2010 },
  { date: "2025-07-27", goal: 2000, actual: 1973 },
  { date: "2025-07-28", goal: 2000, actual: 2023 },
  { date: "2025-07-29", goal: 2000, actual: 2155 },
  { date: "2025-07-30", goal: 2000, actual: 1895 },
  { date: "2025-07-31", goal: 2000, actual: 1837 },
  { date: "2025-08-01", goal: 2000, actual: 1900 },
  { date: "2025-08-02", goal: 2000, actual: 1962 },
  { date: "2025-08-03", goal: 2000, actual: 2015 },
  { date: "2025-08-04", goal: 2000, actual: 2061 },
  { date: "2025-08-05", goal: 2000, actual: 1916 },
  { date: "2025-08-06", goal: 2000, actual: 2197 },
  { date: "2025-08-07", goal: 2000, actual: 2169 },
  { date: "2025-08-08", goal: 2000, actual: 1802 },
  { date: "2025-08-09", goal: 2000, actual: 1872 },
  { date: "2025-08-10", goal: 2000, actual: 2074 },
];

const chartConfig = {
  goal: {
    label: "Goal",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Actual Calories",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CaloriesLineChart() {
  const [timeRange, setTimeRange] = useState("90");

  const chartData = useMemo(() => {
    const days = Number(timeRange);
    return data.slice(-days);
  }, [timeRange]);

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
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[goalCalories - 400, goalCalories + 400]} // keeps goal centered
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="goal"
              type="monotone"
              stroke="var(--color-goal)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              strokeWidth={2}
              activeDot={{
                r: 6,
              }}
              dot={{
                fill: "var(--color-actual)",
              }}
            />
          </LineChart>
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
