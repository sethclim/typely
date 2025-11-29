import { useEffect, useState } from 'react'
import './App.css'

import { DB } from "./db";

import { ResumeProvider } from './context/resume/ResumeProvider'
import { ResumeView } from './components/ResumeView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CreateDemoResume } from './helpers/CreateDemoResume';
import { Sidebar } from './components/Sidebar';
import { ResumeConfigTable } from './db/tables';
import { ResumeConfigRow } from './db/types';

function App() {

  const [activeId, setActiveId] = useState(1);
  const [resumes, setResumes] = useState<ResumeConfigRow[]>([]);

  useEffect(() => {
      const init = async () => {
        await DB.ready;
        const rows = ResumeConfigTable.getResumeConfig(1);
        if(rows.length == 0)
          CreateDemoResume();
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

export default App
