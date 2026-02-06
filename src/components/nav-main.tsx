import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { QuickAddDrawer } from "./quick-add-drawer";

type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
};

type NavGroup = {
  label: string;
  items: NavItem[];
  showQuickAdd?: boolean;
  comingSoon?: boolean;
};

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { setOpenMobile } = useSidebar();

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            {group.comingSoon ? (
              <div className="relative">
                <SidebarMenu className="select-none">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton tooltip={item.title} disabled>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
                <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px] rounded-md">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/80 bg-muted px-3 py-1 rounded-full border border-border">
                    Coming soon
                  </span>
                </div>
              </div>
            ) : (
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.url === currentPath;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => {
                          navigate({ to: item.url });
                          setOpenMobile(false);
                        }}
                        tooltip={item.title}
                        isActive={isActive}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                {group.showQuickAdd && <QuickAddDrawer />}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
