import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import '../App.css'
import { UserProvider } from '../context/user/UserProvider'
import { ThemesProvider } from '../context/themes/ThemesProvider'


export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

  return (
    <>
      <ThemesProvider>
        <UserProvider>
          <Outlet />
        </UserProvider>
      </ThemesProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}