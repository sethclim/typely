import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import '../App.css'
import { UserProvider } from '../context/user/UserProvider'
import { DataProvider } from '../context/data/DataProvider'
// import { ThemesProvider } from '../context/themes/ThemesProvider'


export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

  return (
    <>
     {/* <DataProvider storageKey={'db'} > */}
        <UserProvider>
          <Outlet />
        </UserProvider>
     {/* </DataProvider> */}
     <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
