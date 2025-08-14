import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { getDayData, saveDayData } from "@/lib/firebaseUtils";
import { useAuth } from "./auth-provider";
import { toast } from "sonner";
import type { DayData } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

export const SingleDateDisplay = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dayData, setDayData] = useState<DayData | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setDayData(null);

        const dayData = await getDayData(user, date);

        setDayData(dayData);
      } catch (error) {
        console.error("Error fetching day data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [date, user]);

  const handleSave = async () => {
    const selectedDate = date?.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const result = await saveDayData(user, {
      date: selectedDate || "",
      totalCalories: dayData?.totalCalories || 0,
    });

    if (result.success)
      toast("Success", {
        description: result.message,
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
    else
      toast.error("Error", {
        description: result.message,
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row items-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
      <Card className="@container/card w-full md:w-[320px] h-[340px] justify-between">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Day Data
          </CardTitle>
        </CardHeader>
        {loading && (
          <CardContent>
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4" />
          </CardContent>
        )}
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="totalCalories">Total calories</Label>
            <Input
              id="totalCalories"
              type="number"
              required
              value={dayData?.totalCalories ?? ""}
              onChange={(e) => {
                const calories = Number(e.target.value);
                setDayData((prev) => ({
                  ...(prev ?? {
                    date: date?.toLocaleDateString("en-CA") || "",
                    totalCalories: 0,
                  }),
                  totalCalories: calories,
                }));
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Button className="w-full" onClick={handleSave}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
