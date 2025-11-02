import React, { useEffect, useState } from "react";
import { ResumeContext } from "./ResumeContext";
import { Resume } from "../../App";
import { ResumeTable } from "../../db/tables";
import { DB } from "../../db";

type ResumeProviderProps = {
  resumeId: number;
  children: React.ReactNode;
};

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ resumeId, children }) => {
  const [resume, setResume] = useState<Resume | null>(null);

  const fetchResume = async () => {
    await DB.ready;
    const data = await ResumeTable.getResume(resumeId);
    console.log("data " + JSON.stringify(data))
    setResume(data);
  };

  useEffect(() => {
    fetchResume();
    const unsubscribe = ResumeTable.subscribe(fetchResume);
    return () => unsubscribe();
  }, [resumeId]);

  return (
    <ResumeContext.Provider value={{ resume, refresh: fetchResume }}>
      {children}
    </ResumeContext.Provider>
  );
};