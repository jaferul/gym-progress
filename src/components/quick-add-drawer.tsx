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

export const QuickAddDrawer = () => {
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [calories, setCalories] = useState("");
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
            <DrawerTitle>Total calories today: {totalCalories}</DrawerTitle>
            <DrawerDescription>
              Your daily goal is currently set at 2000 kcal.
            </DrawerDescription>
          </DrawerHeader>
          <Input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <DrawerFooter>
            <Button
              onClick={() => {
                setTotalCalories((prev) => prev + (Number(calories) || 0));
                setCalories("");
              }}
            >
              Add calories
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
