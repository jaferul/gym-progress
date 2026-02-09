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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { SidebarMenuButton } from "./ui/sidebar";
import { IconPlus } from "@tabler/icons-react";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { getMeals, saveDayData } from "@/lib/firebaseUtils";
import { formatDate } from "@/lib/utils";
import type { Meal } from "@/types";
import { Spinner } from "./ui/spinner";

export const QuickAddDrawer = () => {
  const [calories, setCalories] = useState("");
  const { goalCalories, todayCalories, user } = useAuth();
  const [customMealsOpen, setCustomMealsOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingMealId, setAddingMealId] = useState<string | null>(null);

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

  const fetchMeals = async () => {
    if (!user) return;
    setMealsLoading(true);
    const fetchedMeals = await getMeals(user);
    setMeals(fetchedMeals);
    setMealsLoading(false);
  };

  useEffect(() => {
    if (customMealsOpen) {
      fetchMeals();
      setSearchQuery("");
    }
  }, [customMealsOpen, user]);

  const handleAddMealCalories = async (meal: Meal) => {
    if (!user) return;
    setAddingMealId(meal.id);

    await saveDayData(
      user,
      {
        date: formatDate(new Date()),
        totalCalories: meal.calories + (todayCalories || 0),
      },
      true,
      `Added ${meal.calories} kcal from "${meal.name}".`,
    );

    setAddingMealId(null);
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
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

      <Dialog open={customMealsOpen} onOpenChange={setCustomMealsOpen}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Add from custom meals</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="h-64 overflow-y-auto">
            {mealsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner />
              </div>
            ) : filteredMeals.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                {searchQuery ? "No meals found." : "No custom meals yet."}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="font-medium capitalize">{meal.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {meal.calories} kcal
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddMealCalories(meal)}
                      disabled={addingMealId === meal.id}
                    >
                      {addingMealId === meal.id ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <IconPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
