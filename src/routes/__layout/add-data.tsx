import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__layout/add-data')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__layout/add-data"!</div>
}
