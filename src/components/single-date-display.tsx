import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import {
  deleteMealTracking,
  getDayData,
  saveDayData,
} from "@/lib/firebaseUtils";
import { useAuth } from "./auth-provider";
import type { DayData, Meal, MealPlanItem } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { formatDate } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { CustomMealsDialog } from "./custom-meals-dialog";
import { Slider } from "./ui/slider";
import { PlusIcon, Trash2Icon, XIcon } from "lucide-react";

export const SingleDateDisplay = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dayData, setDayData] = useState<DayData | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customMealsOpen, setCustomMealsOpen] = useState(false);

  const [trackingMeals, setTrackingMeals] = useState(false);
  const [dayMeals, setDayMeals] = useState<MealPlanItem[]>([]);
  const [mealSliders, setMealSliders] = useState<Record<string, number>>({});
  const [addingMeal, setAddingMeal] = useState(false);
  const [newMealName, setNewMealName] = useState("");
  const [newMealTarget, setNewMealTarget] = useState<number | "">("");
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const { user, mealPlan, goalCalories } = useAuth();

  const hasMealPlan = mealPlan.length > 0;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setDayData(null);
        setTrackingMeals(false);
        setAddingMeal(false);

        const data = await getDayData(user, date);
        await new Promise((resolve) => setTimeout(resolve, 500));

        setDayData(data);

        if (data?.dayMealPlan && data?.mealSliders) {
          setTrackingMeals(true);
          setDayMeals(data.dayMealPlan);
          const sliders: Record<string, number> = {};
          for (const meal of data.dayMealPlan) {
            sliders[meal.name] = data.mealSliders[meal.name] ?? 0;
          }
          setMealSliders(sliders);
        }
      } catch (error) {
        console.error("Error fetching day data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [date, user]);

  const sliderTotal = useMemo(() => {
    return Object.values(mealSliders).reduce((sum, val) => sum + val, 0);
  }, [mealSliders]);

  const handleStartTracking = () => {
    setTrackingMeals(true);
    setDayMeals([...mealPlan]);
    const sliders: Record<string, number> = {};
    for (const meal of mealPlan) {
      sliders[meal.name] = 0;
    }
    setMealSliders(sliders);
  };

  const handleDeleteTracking = async () => {
    const selectedDate = formatDate(date);
    if (selectedDate) {
      await deleteMealTracking(user, selectedDate);
    }
    setTrackingMeals(false);
    setDayMeals([]);
    setMealSliders({});
    setAddingMeal(false);
    setDayData((prev) => {
      if (!prev) return prev;
      const { mealSliders: _, dayMealPlan: __, ...rest } = prev;
      return rest;
    });
  };

  const handleSliderChange = (mealName: string, value: number) => {
    setMealSliders((prev) => ({ ...prev, [mealName]: value }));
  };

  const handleRemoveMeal = (mealName: string) => {
    setDayMeals((prev) => prev.filter((m) => m.name !== mealName));
    setMealSliders((prev) => {
      const next = { ...prev };
      delete next[mealName];
      return next;
    });
  };

  const handleAddMeal = () => {
    if (!newMealName.trim() || !newMealTarget) return;
    const item: MealPlanItem = {
      name: newMealName.trim(),
      targetCalories: Number(newMealTarget),
    };
    setDayMeals((prev) => [...prev, item]);
    setMealSliders((prev) => ({ ...prev, [item.name]: 0 }));
    setNewMealName("");
    setNewMealTarget("");
    setAddingMeal(false);
  };

  const handleSaveMealTracking = async () => {
    const selectedDate = formatDate(date);
    await saveDayData(
      user,
      {
        date: selectedDate || "",
        totalCalories: sliderTotal,
        mealSliders,
        dayMealPlan: dayMeals,
      },
      true,
    );
    setDayData((prev) => ({
      ...(prev ?? { date: selectedDate, totalCalories: 0 }),
      totalCalories: sliderTotal,
      mealSliders,
      dayMealPlan: dayMeals,
    }));
  };

  const handleAddMealCalories = async (meal: Meal) => {
    if (!user || !date) return;
    const newCalories = (dayData?.totalCalories || 0) + meal.calories;
    await saveDayData(
      user,
      { date: formatDate(date) || "", totalCalories: newCalories },
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
      { date: selectedDate || "", totalCalories: dayData?.totalCalories || 0 },
      true,
    );
  };

  return (
    <>
      <div className="items-center flex flex-col gap-6 md:flex-row md:items-start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border shrink-0"
        />

        {date ? (
          <Card className="w-full max-w-sm min-w-0 overflow-hidden">
            {loading ? (
              <CardContent className="flex items-center justify-center py-16">
                <Spinner />
              </CardContent>
            ) : (
              <>
                <CardContent className="pt-6 pb-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                    {date.toLocaleDateString("en-US", { weekday: "long" })}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight mb-5">
                    {date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h2>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="totalCalories"
                      className="text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      Total calories
                    </Label>
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
                      className="text-base h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
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
                    {hasMealPlan && !trackingMeals && (
                      <Button
                        className="w-full"
                        variant="secondary"
                        onClick={handleStartTracking}
                      >
                        Track meals
                      </Button>
                    )}
                  </div>
                </CardContent>

                {trackingMeals && (
                  <>
                    <div className="mx-6 border-t" />
                    <CardContent className="pt-5 pb-6">
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                        Meal tracking
                      </p>

                      <div className="flex flex-col gap-5">
                        {dayMeals.map((meal) => {
                          const value = mealSliders[meal.name] ?? 0;
                          const pct =
                            meal.targetCalories > 0
                              ? Math.min(value / meal.targetCalories, 1)
                              : 0;
                          const isOver = value > meal.targetCalories;

                          return (
                            <div key={meal.name} className="grid gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                  {meal.name}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={
                                      editingMeal === meal.name
                                        ? editingValue
                                        : value
                                    }
                                    onChange={(e) => {
                                      const raw = e.target.value;
                                      if (raw === "" || /^\d+$/.test(raw)) {
                                        setEditingValue(raw);
                                        handleSliderChange(
                                          meal.name,
                                          raw === "" ? 0 : parseInt(raw, 10),
                                        );
                                      }
                                    }}
                                    onFocus={() => {
                                      setEditingMeal(meal.name);
                                      setEditingValue(
                                        value === 0 ? "" : String(value),
                                      );
                                    }}
                                    onBlur={() => setEditingMeal(null)}
                                    className={`h-7 w-14 rounded-md border bg-background text-sm text-right tabular-nums px-1.5 focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${isOver ? "border-destructive text-destructive" : "border-input"}`}
                                  />
                                  <span className="text-sm text-muted-foreground tabular-nums">
                                    / {meal.targetCalories}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMeal(meal.name)}
                                    className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                                  >
                                    <Trash2Icon className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-75 ${isOver ? "bg-destructive/70" : "bg-primary/20"}`}
                                      style={{ width: `${pct * 100}%` }}
                                    />
                                  </div>
                                </div>
                                <Slider
                                  value={[value]}
                                  min={0}
                                  max={meal.targetCalories}
                                  step={10}
                                  onValueChange={(val) =>
                                    handleSliderChange(meal.name, val[0])
                                  }
                                  className="relative"
                                />
                              </div>
                            </div>
                          );
                        })}
                        {addingMeal ? (
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="text"
                              placeholder="Meal name"
                              value={newMealName}
                              onChange={(e) => setNewMealName(e.target.value)}
                              className="h-8 text-sm flex-1"
                              autoFocus
                            />
                            <Input
                              type="number"
                              placeholder="kcal"
                              value={newMealTarget}
                              onChange={(e) =>
                                setNewMealTarget(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                                )
                              }
                              className="h-8 text-sm w-20"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 shrink-0"
                              onClick={handleAddMeal}
                            >
                              <PlusIcon className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 shrink-0"
                              onClick={() => {
                                setAddingMeal(false);
                                setNewMealName("");
                                setNewMealTarget("");
                              }}
                            >
                              <XIcon className="size-4" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAddingMeal(true)}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                          >
                            <PlusIcon className="size-3.5" />
                            Add meal
                          </button>
                        )}
                        <div className="flex items-baseline justify-between pt-3 border-t">
                          <span className="text-sm font-semibold">
                            Day Total
                          </span>
                          <div className="text-right">
                            <span
                              className={`text-xl font-semibold tabular-nums ${sliderTotal > (goalCalories || Infinity) ? "text-destructive" : ""}`}
                            >
                              {sliderTotal.toLocaleString()}
                            </span>
                            {goalCalories ? (
                              <span className="text-sm text-muted-foreground tabular-nums">
                                {" "}
                                / {goalCalories.toLocaleString()} kcal
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {" "}
                                kcal
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-5">
                        <Button
                          className="w-full"
                          onClick={handleSaveMealTracking}
                        >
                          Save meal tracking
                        </Button>
                        <Button
                          className="w-full"
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteTracking}
                        >
                          <Trash2Icon className="size-4 mr-1.5" />
                          Delete meal tracking
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </>
            )}
          </Card>
        ) : (
          <Card className="w-full flex items-center justify-center py-16 text-muted-foreground text-sm">
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
