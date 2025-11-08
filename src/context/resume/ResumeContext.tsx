import { createContext, useContext } from "react";
import { ResumeConfig } from "../../types";


type ResumeContextType = {
  resume: ResumeConfig | null;
  refresh: () => void;
};

export const ResumeContext = createContext<ResumeContextType>({
  resume: null,
  refresh: () => {},
});

// Custom hook to use context
export const useResume = () => useContext(ResumeContext);
