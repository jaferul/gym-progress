import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import type { DayData } from "@/types";
import type { User } from "firebase/auth";

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

    const daysRef = collection(db, "users", user.uid, "days");
    const q = query(
      daysRef,
      where(
        "date",
        ">=",
        startDate?.toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      ),
      where(
        "date",
        "<=",
        endDate?.toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      ),
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

    if (!date) throw new Error("Date must be provided.");

    const dayDocRef = doc(
      db,
      "users",
      user.uid,
      "days",
      date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    );
    const dayDocSnap = await getDoc(dayDocRef);

    return dayDocSnap.data() as DayData;
  } catch (error) {
    console.error("Error fetching day data:", error);
    return null;
  }
};
