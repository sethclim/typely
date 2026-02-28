import { useRouter, useRouterState } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "@tanstack/react-router";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../helpers/SupabaseClient";


type ResumeProviderProps = {
//   resumeId: number;
  children: React.ReactNode;
};

export const UserProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate()
  const router = useRouter()
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    return router.subscribe('onResolved', (event) => {
      previousPath.current = event.fromLocation?.pathname ?? null
    })
  }, [router])
  
  useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
          setUser(data.session?.user ?? null);
        });

        // Whenever the auth state changes, we receive an event and a session object.
        // Save the user from the session object to the state.
       supabase.auth.onAuthStateChange((event, session) => { //Func Changed 02/27/26
  if (event === "SIGNED_IN") {
    console.log("User" + JSON.stringify(session?.user))

  setUser(session?.user ?? null);
 
  if (previousPath.current) {
    navigate({ to: previousPath.current });
  }
}
});
    }, []
  )

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};