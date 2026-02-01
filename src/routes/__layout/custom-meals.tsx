import { CustomMeals } from "@/components/custom-meals";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__layout/custom-meals")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomMeals />;
}
