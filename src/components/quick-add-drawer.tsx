import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { SidebarMenuButton } from "./ui/sidebar";
import { IconPlus } from "@tabler/icons-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAuth } from "./auth-provider";
import { saveDayData } from "@/lib/firebaseUtils";
import { formatDate } from "@/lib/utils";
import type { Meal } from "@/types";
import { CustomMealsDialog } from "./custom-meals-dialog";

export const QuickAddDrawer = () => {
  const [calories, setCalories] = useState("");
  const { goalCalories, todayCalories, user } = useAuth();
  const [customMealsOpen, setCustomMealsOpen] = useState(false);

  const handleAddCalories = async () => {
    if (!user) return;

    const caloriesToAdd = Number(calories);
    await saveDayData(
      user,
      {
        date: formatDate(new Date()),
        totalCalories: caloriesToAdd + (todayCalories || 0),
      },
      true,
      `You have added ${caloriesToAdd} calories.`,
    );

    setCalories("");
  };

  const handleAddMealCalories = async (meal: Meal) => {
    if (!user) return;

    await saveDayData(
      user,
      {
        date: formatDate(new Date()),
        totalCalories: meal.calories + (todayCalories || 0),
      },
      true,
      `Added ${meal.calories} kcal from "${meal.name}".`,
    );
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <SidebarMenuButton tooltip="Quick add">
            <IconPlus />
            <span>Quick add</span>
          </SidebarMenuButton>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm px-4 sm:px-0">
            <DrawerHeader className="px-0">
              <DrawerTitle>Total calories today: {todayCalories}</DrawerTitle>
              <DrawerDescription>
                Your daily goal is currently set at {goalCalories} kcal.
              </DrawerDescription>
            </DrawerHeader>
            <Input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Enter calories"
            />
            <DrawerFooter className="px-0">
              <Button onClick={handleAddCalories}>Add calories</Button>
              <Button
                variant="secondary"
                onClick={() => setCustomMealsOpen(true)}
              >
                Add from custom meals
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <CustomMealsDialog
        open={customMealsOpen}
        onOpenChange={setCustomMealsOpen}
        onAddMeal={handleAddMealCalories}
      />
    </>
  );
};
