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
import { getMeals, saveMeal } from "@/lib/firebaseUtils";
import { toast } from "sonner";
import type { Meal } from "@/types";

export const CustomMeals = () => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number | undefined>(undefined);
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [refetchMeals, setRefetchMeals] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const mealsResponse = await getMeals(user);
      setMeals(mealsResponse);
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
              onChange={(e) => setCalories(Number(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="w-[100%] sm:w-[50%]" onClick={handleSave}>
            Add Meal
          </Button>
        </CardFooter>
      </Card>
      <CustomMealsTable meals={meals} refetchMeals={setRefetchMeals} />
    </div>
  );
};
