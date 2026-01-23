import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DataProvider } from '../../context/data/DataProvider'

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
        <DataProvider storageKey={'demoDb'} >
          <Outlet />
        </DataProvider>
      )
}
