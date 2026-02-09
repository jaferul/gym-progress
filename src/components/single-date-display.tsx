import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { getDayData, saveDayData } from "@/lib/firebaseUtils";
import { useAuth } from "./auth-provider";
import type { DayData, Meal } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { formatDate } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { CustomMealsDialog } from "./custom-meals-dialog";

export const SingleDateDisplay = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dayData, setDayData] = useState<DayData | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customMealsOpen, setCustomMealsOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setDayData(null);

        const dayData = await getDayData(user, date);
        await new Promise((resolve) => setTimeout(resolve, 500)); // this is to avoid flickering

        setDayData(dayData);
      } catch (error) {
        console.error("Error fetching day data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [date, user]);

  const handleAddMealCalories = async (meal: Meal) => {
    if (!user || !date) return;

    const newCalories = (dayData?.totalCalories || 0) + meal.calories;
    await saveDayData(
      user,
      {
        date: formatDate(date) || "",
        totalCalories: newCalories,
      },
      true,
    );

    setDayData((prev) => ({
      ...(prev ?? { date: formatDate(date), totalCalories: 0 }),
      totalCalories: newCalories,
    }));
  };

  const handleSave = async () => {
    const selectedDate = formatDate(date);
    await saveDayData(
      user,
      {
        date: selectedDate || "",
        totalCalories: dayData?.totalCalories || 0,
      },
      true,
    );
  };

  return (
    <>
    <div className="flex flex-col gap-4 md:flex-row items-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
      {date ? (
        <Card className="@container/card w-full md:w-[320px] h-[340px] justify-between">
          <CardHeader>
            <CardDescription>{date?.toDateString()}</CardDescription>

            <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
              Day Data
            </CardTitle>
          </CardHeader>

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <CardContent>
                <div className="grid gap-3">
                  <Label htmlFor="totalCalories">Total calories</Label>
                  <Input
                    id="totalCalories"
                    type="number"
                    required
                    value={dayData?.totalCalories || ""}
                    onChange={(e) => {
                      const calories = Number(e.target.value);
                      setDayData((prev) => ({
                        ...(prev ?? {
                          date: formatDate(date),
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
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => setCustomMealsOpen(true)}
                >
                  Add from custom meals
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      ) : (
        <Card className="w-full md:w-[320px] h-[340px] flex items-center justify-center text-muted-foreground text-sm">
          No date selected
        </Card>
      )}
    </div>

    <CustomMealsDialog
      open={customMealsOpen}
      onOpenChange={setCustomMealsOpen}
      onAddMeal={handleAddMealCalories}
    />
    </>
  );
};
