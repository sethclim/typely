import React, { useEffect, useState } from "react";
import { ResumeContext } from "./ResumeContext";
import { ResumeConfig } from "../../types";
import { hydrateResume } from "../../helpers/ResumeHydrator";
import { useDataContext } from "../data/DataContext";

type ResumeProviderProps = {
  resumeId: number;
  children: React.ReactNode;
};

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ resumeId, children }) => {
  const [resume, setResume] = useState<ResumeConfig | null>(null);

  const { repositories } = useDataContext()

  const fetchResume = async () => {
    // await DB.tablesReady;
    const data = await repositories.resumeConfig.getResumeConfig(resumeId);
    const hydratedResume = hydrateResume(data)
    console.log("hydratedResume " + hydratedResume?.name);
    setResume(hydratedResume);
  };

  useEffect(() => {
    fetchResume();
    const unsubscribe = repositories.resumeConfig.subscribe(fetchResume);
    return () => unsubscribe();
  }, [resumeId]);

  return (
    <ResumeContext.Provider value={{ resume, refresh: fetchResume }}>
      {children}
    </ResumeContext.Provider>
  );
};