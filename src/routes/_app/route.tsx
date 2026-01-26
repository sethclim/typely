import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DataProvider } from '../../context/data/DataProvider'

export const Route = createFileRoute('/_app')({
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <DataProvider storageKey={'db'} >
      <Outlet />
    </DataProvider>
  )
}
