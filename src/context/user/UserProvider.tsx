import React, { useEffect, useState } from "react";
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

  useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
          setUser(data.session?.user ?? null);
        });

        // Whenever the auth state changes, we receive an event and a session object.
        // Save the user from the session object to the state.
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
                setUser(session?.user ?? null);
                if (window.location.pathname === '/login') {
                  navigate({ to: '/app' });
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