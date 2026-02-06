import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "./auth-provider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { getRangeDaysData } from "@/lib/firebaseUtils";
import type { DayData } from "@/types";

export function MultipleDatesDisplay() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const [dayDataList, setDayDataList] = useState<DayData[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setDayDataList([]);

        const daysData = await getRangeDaysData(
          user,
          dateRange?.from,
          dateRange?.to,
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        setDayDataList(daysData);
      } catch (error) {
        console.error("Error fetching day data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [dateRange, user]);

  return (
    <div className="flex flex-col gap-4 md:flex-row items-center">
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        className="rounded-lg border shadow-sm h-[340px]"
      />
      <Card className="p-10 h-[340px] overflow-y-auto w-full md:w-[320px]">
        <Table>
          {!loading && (
            <TableCaption>
              {dayDataList && dayDataList.length > 0
                ? "A list of your total calories per day"
                : "No data available to display"}
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Total calories</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 " />
                </TableCell>
              </TableRow>
            )}
            {dayDataList?.map((day) => (
              <TableRow key={day.date}>
                <TableCell className="font-medium">
                  {new Date(day.date).toDateString()}
                </TableCell>
                <TableCell>{day.totalCalories} kcal</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
