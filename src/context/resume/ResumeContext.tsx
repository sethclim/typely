import { createContext, useContext } from "react";
import { Resume } from "../../App";


type ResumeContextType = {
  resume: Resume | null;
  refresh: () => void;
};

export const ResumeContext = createContext<ResumeContextType>({
  resume: null,
  refresh: () => {},
});

// Custom hook to use context
export const useResume = () => useContext(ResumeContext);
