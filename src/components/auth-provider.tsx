import { auth, db } from "@/firebaseConfig";
import { formatDate } from "@/lib/utils";
import type { DayData, MealPlanItem } from "@/types";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  where,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

const demoData = [
  { date: "2025-05-13", totalCalories: 1866 },
  { date: "2025-05-14", totalCalories: 1992 },
  { date: "2025-05-15", totalCalories: 1853 },
  { date: "2025-05-16", totalCalories: 2191 },
  { date: "2025-05-17", totalCalories: 2044 },
  { date: "2025-05-18", totalCalories: 2025 },
  { date: "2025-05-19", totalCalories: 2155 },
  { date: "2025-05-20", totalCalories: 1923 },
  { date: "2025-05-21", totalCalories: 1893 },
  { date: "2025-05-22", totalCalories: 1986 },
  { date: "2025-05-23", totalCalories: 1926 },
  { date: "2025-05-24", totalCalories: 1984 },
  { date: "2025-05-25", totalCalories: 2180 },
  { date: "2025-05-26", totalCalories: 2144 },
  { date: "2025-05-27", totalCalories: 1838 },
  { date: "2025-05-28", totalCalories: 2136 },
  { date: "2025-05-29", totalCalories: 2195 },
  { date: "2025-05-30", totalCalories: 1947 },
  { date: "2025-05-31", totalCalories: 2066 },
  { date: "2025-06-01", totalCalories: 2121 },
  { date: "2025-06-02", totalCalories: 1927 },
  { date: "2025-06-03", totalCalories: 1867 },
  { date: "2025-06-04", totalCalories: 1813 },
  { date: "2025-06-05", totalCalories: 1928 },
  { date: "2025-06-06", totalCalories: 2111 },
  { date: "2025-06-07", totalCalories: 1842 },
  { date: "2025-06-08", totalCalories: 2108 },
  { date: "2025-06-09", totalCalories: 1861 },
  { date: "2025-06-10", totalCalories: 2103 },
  { date: "2025-06-11", totalCalories: 1923 },
  { date: "2025-06-12", totalCalories: 2028 },
  { date: "2025-06-13", totalCalories: 1882 },
  { date: "2025-06-14", totalCalories: 1836 },
  { date: "2025-06-15", totalCalories: 2083 },
  { date: "2025-06-16", totalCalories: 1989 },
  { date: "2025-06-17", totalCalories: 1893 },
  { date: "2025-06-18", totalCalories: 1979 },
  { date: "2025-06-19", totalCalories: 1829 },
  { date: "2025-06-20", totalCalories: 1837 },
  { date: "2025-06-21", totalCalories: 2068 },
  { date: "2025-06-22", totalCalories: 2093 },
  { date: "2025-06-23", totalCalories: 1941 },
  { date: "2025-06-24", totalCalories: 2184 },
  { date: "2025-06-25", totalCalories: 2002 },
  { date: "2025-06-26", totalCalories: 2197 },
  { date: "2025-06-27", totalCalories: 2040 },
  { date: "2025-06-28", totalCalories: 1961 },
  { date: "2025-06-29", totalCalories: 1983 },
  { date: "2025-06-30", totalCalories: 2065 },
  { date: "2025-07-01", totalCalories: 2167 },
  { date: "2025-07-02", totalCalories: 2017 },
  { date: "2025-07-03", totalCalories: 2018 },
  { date: "2025-07-04", totalCalories: 1835 },
  { date: "2025-07-05", totalCalories: 2043 },
  { date: "2025-07-06", totalCalories: 1873 },
  { date: "2025-07-07", totalCalories: 1879 },
  { date: "2025-07-08", totalCalories: 1992 },
  { date: "2025-07-09", totalCalories: 2081 },
  { date: "2025-07-10", totalCalories: 2192 },
  { date: "2025-07-11", totalCalories: 1993 },
  { date: "2025-07-12", totalCalories: 1979 },
  { date: "2025-07-13", totalCalories: 1820 },
  { date: "2025-07-14", totalCalories: 2052 },
  { date: "2025-07-15", totalCalories: 1862 },
  { date: "2025-07-16", totalCalories: 1813 },
  { date: "2025-07-17", totalCalories: 2172 },
  { date: "2025-07-18", totalCalories: 2097 },
  { date: "2025-07-19", totalCalories: 2029 },
  { date: "2025-07-20", totalCalories: 2118 },
  { date: "2025-07-21", totalCalories: 1900 },
  { date: "2025-07-22", totalCalories: 2097 },
  { date: "2025-07-23", totalCalories: 1868 },
  { date: "2025-07-24", totalCalories: 2175 },
  { date: "2025-07-25", totalCalories: 2062 },
  { date: "2025-07-26", totalCalories: 2010 },
  { date: "2025-07-27", totalCalories: 1973 },
  { date: "2025-07-28", totalCalories: 2023 },
  { date: "2025-07-29", totalCalories: 2155 },
  { date: "2025-07-30", totalCalories: 1895 },
  { date: "2025-07-31", totalCalories: 1837 },
  { date: "2025-08-01", totalCalories: 1900 },
  { date: "2025-08-02", totalCalories: 1962 },
  { date: "2025-08-03", totalCalories: 2015 },
  { date: "2025-08-04", totalCalories: 2061 },
  { date: "2025-08-05", totalCalories: 1916 },
  { date: "2025-08-06", totalCalories: 2197 },
  { date: "2025-08-07", totalCalories: 2169 },
  { date: "2025-08-08", totalCalories: 1802 },
  { date: "2025-08-09", totalCalories: 1872 },
  { date: "2025-08-10", totalCalories: 2074 },
];

const demoGoalCalories = 2000;

export type AuthContextType = {
  user: User | null;
  displayName: string;
  avatarId: string;
  isInitialLoading: boolean;
  isAuthenticated: boolean;
  data: DayData[];
  goalCalories?: number;
  todayCalories?: number;
  mealPlan: MealPlanItem[];
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isInitialLoading: true,
  isAuthenticated: false,
  displayName: "",
  avatarId: "",
  data: [],
  goalCalories: 0,
  todayCalories: 0,
  mealPlan: [],
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<DayData[]>([]);
  const [goalCalories, setGoalCalories] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [mealPlan, setMealPlan] = useState<MealPlanItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      flushSync(() => {
        setUser(user);
        setDisplayName(user?.displayName || "");

        //TODO: change logic here to account for verified
        if (!user) {
          setData(demoData);
          setGoalCalories(demoGoalCalories);
          setTodayCalories(0);
        } else {
          setData([]);
        }

        setIsInitialLoading(false);
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        const userData = doc.data();
        setGoalCalories(userData?.goalCalories || 0);
        setDisplayName(userData?.displayName || userData?.name || "");
        setAvatarId(userData?.avatarId || "");
        setMealPlan(userData?.mealPlan || []);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.emailVerified) {
      const daysCollectionRef = collection(db, "users", user.uid, "days");
      const daysQuery = query(
        daysCollectionRef,
        orderBy("date", "desc"),
        limit(90),
      );

      const unsubscribeSnapshot = onSnapshot(daysQuery, (querySnapshot) => {
        const daysData: DayData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.date && data.totalCalories !== undefined) {
            daysData.push({
              date: data.date,
              totalCalories: data.totalCalories,
            });
          }
        });

        setData(daysData.reverse());
      });

      const today = formatDate(new Date());
      const todayQuery = query(
        daysCollectionRef,
        where("date", "==", today),
        limit(1),
      );

      const unsubscribeTodaySnapshot = onSnapshot(
        todayQuery,
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            const todayData = querySnapshot.docs[0].data();
            if (todayData && todayData.totalCalories !== undefined) {
              setTodayCalories(todayData.totalCalories);
            } else {
              setTodayCalories(0);
            }
          } else {
            setTodayCalories(0);
          }
        },
      );

      return () => {
        unsubscribeSnapshot();
        unsubscribeTodaySnapshot();
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        displayName,
        avatarId,
        isInitialLoading,
        isAuthenticated,
        data,
        goalCalories,
        todayCalories,
        mealPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useSettings must be used within a SettingsProvider");

  return context;
};
