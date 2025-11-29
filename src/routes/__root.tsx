import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import '../App.css'
import { UserProvider } from '../context/user/UserProvider'


export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

  return (
    <>
      <UserProvider>
        <Outlet />
      </UserProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}