import { IconFolderCode } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useNavigate } from "@tanstack/react-router";

export function NoDataDisplay() {
  const navigate = useNavigate();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No data available to display</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any data yet. Get started by creating your
          first entry.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => navigate({ to: "/add-data" })}>Add data</Button>
      </EmptyContent>
    </Empty>
  );
}
