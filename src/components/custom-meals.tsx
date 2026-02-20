import { useEffect, useState } from "react";
import { CustomMealsTable } from "./custom-meals-table";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./auth-provider";
import { getMeals, saveMeal, saveMealPlan } from "@/lib/firebaseUtils";
import { toast } from "sonner";
import type { Meal, MealPlanItem } from "@/types";
import { PlusIcon, Trash2Icon } from "lucide-react";

export const CustomMeals = () => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number | undefined>(undefined);
  const { user, mealPlan } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [refetchMeals, setRefetchMeals] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>(mealPlan);

  useEffect(() => {
    setMealPlanItems(mealPlan);
  }, [mealPlan]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const mealsResponse = await getMeals(user);
      setMeals(mealsResponse);
      setLoading(false);
    })();
  }, [user, refetchMeals]);

  const handleSave = async () => {
    const result = await saveMeal(user, {
      name: name || "",
      calories: calories || 0,
    });

    if (result.success) {
      toast("Success", {
        description: result.message,
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
      setRefetchMeals((prev) => !prev);
      setName("");
      setCalories(undefined);
    } else
      toast.error("Error", {
        description: result.message,
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
  };
  return (
    <div className="flex flex-col gap-[32px] sm:gap-[64px] p-4">
      <Card className="w-full sm:w-[50%] self-center">
        <CardHeader>
          <CardTitle>Create custom meal</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mealName">Meal Name</Label>
            <Input
              id="mealName"
              type="text"
              placeholder="Enter meal name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="mealCalories">Meal Calories</Label>
            <Input
              id="mealCalories"
              type="number"
              placeholder="Enter meal calories"
              required
              value={calories ?? ""}
              onChange={(e) =>
                setCalories(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="w-[100%] sm:w-[50%]" onClick={handleSave}>
            Add Meal
          </Button>
        </CardFooter>
      </Card>
      <CustomMealsTable
        loading={loading}
        meals={meals}
        refetchMeals={setRefetchMeals}
      />
      <Card className="w-full sm:w-[50%] self-center">
        <CardHeader>
          <CardTitle>Default Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {mealPlanItems.map((item, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="grid gap-1 flex-1">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">
                      Name
                    </Label>
                  )}
                  <Input
                    type="text"
                    placeholder="Meal name"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...mealPlanItems];
                      updated[index] = { ...item, name: e.target.value };
                      setMealPlanItems(updated);
                    }}
                  />
                </div>
                <div className="grid gap-1 w-24">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">
                      Calories
                    </Label>
                  )}
                  <Input
                    type="number"
                    placeholder="kcal"
                    value={item.targetCalories || ""}
                    onChange={(e) => {
                      const updated = [...mealPlanItems];
                      updated[index] = {
                        ...item,
                        targetCalories: Number(e.target.value),
                      };
                      setMealPlanItems(updated);
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() =>
                    setMealPlanItems(
                      mealPlanItems.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                setMealPlanItems([
                  ...mealPlanItems,
                  { name: "", targetCalories: 0 },
                ])
              }
            >
              <PlusIcon className="size-4 mr-1" />
              Add meal
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-[100%] sm:w-[50%]"
            onClick={() => saveMealPlan(user, mealPlanItems)}
          >
            Save meal plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
