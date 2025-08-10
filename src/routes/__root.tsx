import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import type { AuthContextType } from "@/components/auth-provider";
import { Toaster } from "sonner";

export type MyRouterContext = {
  auth: AuthContextType;
};
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster />
    </ThemeProvider>
  ),
});
