import { MultipleDatesDisplay } from "@/components/multiple-dates-display";
import { SingleDateDisplay } from "@/components/single-date-display";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__layout/add-data")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <SingleDateDisplay />
        </div>
        <div className="px-4 lg:px-6">
          <MultipleDatesDisplay />
        </div>
      </div>
    </div>
  );
}
