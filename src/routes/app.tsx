import { createFileRoute } from '@tanstack/react-router'
import { Application } from '../components/Application';

export const Route = createFileRoute('/app')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
      <Application />
  )
  
}