import { createFileRoute } from '@tanstack/react-router'
import { Application } from '../components/Application';

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return Application();
}
