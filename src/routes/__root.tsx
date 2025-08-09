import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import type { AuthContextType } from "@/components/auth-provider";
import { Toaster } from "sonner";

export type MyRouterContext = {
  auth: AuthContextType;
};
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </ThemeProvider>
  ),
});
