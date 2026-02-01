import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconBurger,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
import { Link, useNavigate } from "@tanstack/react-router";

const data = {
  navMain: [
    {
      title: "Summary",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "See / Add Data",
      url: "/add-data",
      icon: IconDatabase,
    },
    {
      title: "Custom Meals",
      url: "/custom-meals",
      icon: IconBurger,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  Your gym progress
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {isAuthenticated ? (
          <NavUser
            user={{
              name: user?.displayName || "",
              email: user?.email || "",
              avatar: "https://github.com/shadcn.png",
            }}
          />
        ) : (
          <Button onClick={() => navigate({ to: "/sign-in" })}>Sign in</Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
