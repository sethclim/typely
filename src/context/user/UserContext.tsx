import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";


type UserContextType = {
  user: User | null;
//   refresh: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
//   refresh: () => {},
});

// Custom hook to use context
export const useUser = () => useContext(UserContext);
