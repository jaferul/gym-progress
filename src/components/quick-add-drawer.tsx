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
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export const QuickAddDrawer = () => {
  const [calories, setCalories] = useState("");
  const { goalCalories, todayCalories, user } = useAuth();

  const handleAddCalories = async () => {
    if (!user) return;

    const caloriesToAdd = Number(calories);
    const result = await saveDayData(user, {
      date: formatDate(new Date()),
      totalCalories: caloriesToAdd + (todayCalories || 0),
    });

    if (result.success) {
      toast("Calories added successfully!", {
        description: `You have added ${caloriesToAdd} calories.`,
      });
    } else {
      toast.error("Failed to add calories.", {
        description: result.message,
      });
    }

    setCalories("");
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <SidebarMenuButton tooltip="Quick add">
          <IconPlus />
          <span>Quick add</span>
        </SidebarMenuButton>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Total calories today: {todayCalories}</DrawerTitle>
            <DrawerDescription>
              Your daily goal is currently set at {goalCalories} kcal.
            </DrawerDescription>
          </DrawerHeader>
          <Input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <DrawerFooter>
            <Button onClick={handleAddCalories}>Add calories</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
