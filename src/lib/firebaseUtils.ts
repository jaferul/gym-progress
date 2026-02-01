import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import type { DayData, Meal, MealInput } from "@/types";
import type { User } from "firebase/auth";
import { formatDate } from "./utils";

export const saveDayData = async (user: User | null, dayData: DayData) => {
  try {
    if (!user || !user.uid) {
      throw new Error("User must be logged in to save day data.");
    }

    if (user && !user.emailVerified)
      throw new Error("User email must be verified to save data.");

    const dayDocRef = doc(db, "users", user.uid, "days", dayData.date);
    await setDoc(
      dayDocRef,
      { date: dayData.date, totalCalories: dayData.totalCalories },
      { merge: true },
    );
    return { success: true, message: "Day data saved successfully." };
  } catch (error: any) {
    console.error("Error saving day data:", error);
    return {
      success: false,
      message: `Error saving day data: ${error.message}`,
    };
  }
};

export const getRangeDaysData = async (
  user: User | null,
  startDate?: Date,
  endDate?: Date,
) => {
  try {
    if (!user || !user.uid) throw new Error("User must be logged in.");

    if (user && !user.emailVerified)
      throw new Error("User email must be verified to get data.");

    const daysRef = collection(db, "users", user.uid, "days");
    const q = query(
      daysRef,
      where("date", ">=", formatDate(startDate)),
      where("date", "<=", formatDate(endDate)),
    );

    const querySnapshot = await getDocs(q);

    const fetchedDayData: DayData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data.totalCalories) {
        fetchedDayData.push({
          date: data.date,
          totalCalories: data.totalCalories,
        });
      }
    });

    return fetchedDayData;
  } catch (error) {
    console.error("Error fetching day data:", error);
    return [];
  }
};

export const getDayData = async (user: User | null, date?: Date) => {
  try {
    if (!user || !user.uid) throw new Error("User must be logged in.");

    if (user && !user.emailVerified)
      throw new Error("User email must be verified to get data.");

    if (!date) throw new Error("Date must be provided.");

    const dayDocRef = doc(db, "users", user.uid, "days", formatDate(date));
    const dayDocSnap = await getDoc(dayDocRef);

    return dayDocSnap.data() as DayData;
  } catch (error) {
    console.error("Error fetching day data:", error);
    return null;
  }
};

export const saveMeal = async (user: User | null, meal: MealInput) => {
  try {
    if (!user || !user.uid) {
      throw new Error("User must be logged in to save meal data.");
    }

    if (user && !user.emailVerified)
      throw new Error("User email must be verified to save data.");

    const mealId = meal.name.trim().toLowerCase();
    const mealsRef = collection(db, "users", user.uid, "meals");
    const mealDocRef = doc(mealsRef, mealId);
    const mealDocSnap = await getDoc(mealDocRef);

    if (mealDocSnap.exists()) {
      return {
        success: false,
        message: "Meal already exists.",
      };
    }

    await setDoc(mealDocRef, {
      name: meal.name,
      id: mealId,
      calories: meal.calories,
    });

    return { success: true, message: "Meal saved successfully." };
  } catch (error: any) {
    console.error("Error saving meal data:", error);
    return {
      success: false,
      message: `Error saving meal data: ${error.message}`,
    };
  }
};

export const updateMeal = async (user: User | null, meal: Meal) => {
  try {
    if (!user || !user.uid) {
      throw new Error("User must be logged in to update meal data.");
    }

    if (user && !user.emailVerified)
      throw new Error("User email must be verified to update data.");

    const mealsRef = collection(db, "users", user.uid, "meals");
    const mealDocRef = doc(mealsRef, meal.id);
    const mealDocSnap = await getDoc(mealDocRef);

    if (!mealDocSnap.exists()) {
      return {
        success: false,
        message: "Meal does not exist.",
      };
    }

    const newMealId = meal.name.trim().toLowerCase();

    // If name changed, check if new ID already exists
    if (newMealId !== meal.id) {
      const newMealDocRef = doc(mealsRef, newMealId);
      const newMealDocSnap = await getDoc(newMealDocRef);

      if (newMealDocSnap.exists()) {
        return {
          success: false,
          message: "A meal with that name already exists.",
        };
      }

      // Delete old meal and create new one with updated ID
      await setDoc(newMealDocRef, {
        name: meal.name,
        id: newMealId,
        calories: meal.calories,
      });

      // Delete the old document
      await deleteDoc(mealDocRef);
    } else {
      // Name didn't change, just update calories
      await setDoc(mealDocRef, meal, { merge: true });
    }

    return { success: true, message: "Meal updated successfully." };
  } catch (error: any) {
    console.error("Error updating meal data:", error);
    return {
      success: false,
      message: `Error updating meal data: ${error.message}`,
    };
  }
};

export const getMeals = async (user: User | null) => {
  try {
    if (!user || !user.uid) {
      throw new Error("User must be logged in to get meals.");
    }

    if (user && !user.emailVerified)
      throw new Error("User email must be verified to get data.");

    const mealsRef = collection(db, "users", user.uid, "meals");
    const querySnapshot = await getDocs(mealsRef);

    const meals: Meal[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      meals.push({
        id: data.id,
        name: data.name,
        calories: data.calories,
      });
    });

    return meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return [];
  }
};

export const deleteMeal = async (
  user: User | null,
  mealIds: string | string[],
) => {
  try {
    if (!user || !user.uid) {
      throw new Error("User must be logged in to delete meal.");
    }

    if (user && !user.emailVerified)
      throw new Error("User email must be verified to delete data.");

    const idsToDelete = Array.isArray(mealIds) ? mealIds : [mealIds];
    const deletePromises = idsToDelete.map((mealId) =>
      deleteDoc(doc(db, "users", user.uid, "meals", mealId)),
    );

    const results = await Promise.allSettled(deletePromises);
    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      return {
        success: false,
        message: `Failed to delete ${failed.length} of ${idsToDelete.length} meal(s).`,
      };
    }

    return { success: true, message: "Meal(s) deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting meal(s):", error);
    return {
      success: false,
      message: `Error deleting meal(s): ${error.message}`,
    };
  }
};
