import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ResumeView } from '../components/ResumeView';
import { Sidebar } from '../components/Sidebar';
import { ResumeProvider } from '../context/resume/ResumeProvider';
import { DB } from '../db';
import { ResumeConfigTable } from '../db/tables';
import { ResumeConfigRow } from '../db/types';
import { ResumeSidebarContent } from '../components/ResumeSidebarContent';

export const Route = createFileRoute('/app')({
  component: HomeComponent,
})

function HomeComponent() {
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