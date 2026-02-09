import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { getMeals } from "@/lib/firebaseUtils";
import type { Meal } from "@/types";
import { Spinner } from "./ui/spinner";

interface CustomMealsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMeal: (meal: Meal) => Promise<void>;
}

export const CustomMealsDialog = ({
  open,
  onOpenChange,
  onAddMeal,
}: CustomMealsDialogProps) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingMealId, setAddingMealId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMealsLoading(true);
      getMeals(user).then((fetchedMeals) => {
        setMeals(fetchedMeals);
        setMealsLoading(false);
      });
      setSearchQuery("");
    }
  }, [open, user]);

  const handleAddMeal = async (meal: Meal) => {
    setAddingMealId(meal.id);
    await onAddMeal(meal);
    setAddingMealId(null);
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                    onClick={() => handleAddMeal(meal)}
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
  );
};
