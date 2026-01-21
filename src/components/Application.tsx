import { useState, useEffect } from "react";
import { ResumeProvider } from "../context/resume/ResumeProvider";
import { DB } from "../db";
import { ResumeConfigTable } from "../db/tables";
import { ResumeConfigRow } from "../db/types";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ResumeSidebarContent } from "./ResumeSidebarContent";
import { ResumeView } from "./ResumeView";
import { Sidebar } from "./Sidebar";

  
  export const Application = () => {
    const [activeId, setActiveId] = useState(1);
    const [resumes, setResumes] = useState<ResumeConfigRow[]>([]);

    const [expanded, setExpanded] = useState(false);

    const fetchResumes = () => {
        const rows = ResumeConfigTable.getAllResumeConfig();
        setResumes(rows)
    }

    useEffect(() => {
        const init = async () => {
            await DB.ready;
            fetchResumes();
        }
        const unsubscribe = ResumeConfigTable.subscribe(fetchResumes);
        init();
        return () => unsubscribe();
    }, []);

  return (
    <ResumeProvider resumeId={activeId}>
        <Header expanded={expanded} setExpanded={setExpanded} />
        <div className='grow flex flex-row'>
        
            <Sidebar expanded={expanded}>
                <ResumeSidebarContent  resumes={resumes}
                activeId={activeId}
                onSelect={setActiveId}
                expanded={expanded} />
            </Sidebar>
            <ResumeView />
        </div>
        <Footer />
    </ResumeProvider>
  )
}