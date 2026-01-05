import React, { useEffect, useState } from "react";
import { ResumeContext } from "./ResumeContext";
import { ResumeConfigTable } from "../../db/tables";
import { DB } from "../../db";
import { ResumeConfig } from "../../types";
import { hydrateResume } from "../../helpers/ResumeHydrator";

type ResumeProviderProps = {
  resumeId: number;
  children: React.ReactNode;
};

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ resumeId, children }) => {
  const [resume, setResume] = useState<ResumeConfig | null>(null);

  const fetchResume = async () => {
    await DB.tablesReady;
    const data = await ResumeConfigTable.getResumeConfig(resumeId);
    const hydratedResume = hydrateResume(data)
    console.log("hydratedResume " + hydratedResume?.name);
    setResume(hydratedResume);
  };

  useEffect(() => {
    fetchResume();
    const unsubscribe = ResumeConfigTable.subscribe(fetchResume);
    return () => unsubscribe();
  }, [resumeId]);

  return (
    <ResumeContext.Provider value={{ resume, refresh: fetchResume }}>
      {children}
    </ResumeContext.Provider>
  );
};