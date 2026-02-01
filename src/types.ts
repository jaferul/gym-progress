export type DayData = {
  date: string;
  totalCalories: number;
  meals?: number[];
  snacks?: number[];
};

export type Meal = {
  id: string;
  name: string;
  calories: number;
};

export type MealInput = Omit<Meal, "id">;
