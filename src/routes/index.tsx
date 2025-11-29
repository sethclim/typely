import { createClient, User } from '@supabase/supabase-js';
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
import { CreateDemoResume } from '../helpers/CreateDemoResume';
import { supabase } from '../main';


export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {

    
    const [user, setUser] = useState<User>();
    const [activeId, setActiveId] = useState(1);
    const [resumes, setResumes] = useState<ResumeConfigRow[]>([]);

    useEffect(() => {
        const init = async () => {
        await DB.ready;
        const rows = ResumeConfigTable.getResumeConfig(1);
        if(rows.length == 0)
            CreateDemoResume();


        // Whenever the auth state changes, we receive an event and a session object.
        // Save the user from the session object to the state.
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
            setUser(session?.user);
            }
        });
        }
        init();
    }, []
    )

    const fetchResumes = () => {
        const rows = ResumeConfigTable.getAllResumeConfig();
        console.log("fetchResumes " + rows.length)
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
         <Header />
         <div className='flex flex-row'>
             <Sidebar
            resumes={resumes}
            activeId={activeId}
            onSelect={setActiveId}
            />
         <ResumeView />
        </div>
        <Footer />
    </ResumeProvider>
  )
}