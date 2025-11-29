import * as React from 'react'
import { Link, Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import '../App.css'
import { useEffect } from 'react'
import { supabase } from '../main'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {

  const navigate = useNavigate()

  useEffect(() => {
      const init = async () => {  
        // Whenever the auth state changes, we receive an event and a session object.
        // Save the user from the session object to the state.
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
              navigate({
                to: '/',
              })
            }
        });
      }
      init();
    }, []
  )

  return (
    <>
      {/* <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/login"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Login
        </Link>
      </div>
      <hr /> */}
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}