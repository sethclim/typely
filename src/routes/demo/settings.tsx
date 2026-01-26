import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '../../components/Settings'

export const Route = createFileRoute('/demo/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Settings />;
}