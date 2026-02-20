export type MealPlanItem = {
  name: string;
  targetCalories: number;
};

export type DayData = {
  date: string;
  totalCalories: number;
  meals?: number[];
  snacks?: number[];
  mealSliders?: Record<string, number>;
  dayMealPlan?: MealPlanItem[];
};

export type Meal = {
  id: string;
  name: string;
  calories: number;
};

export type MealInput = Omit<Meal, "id">;
