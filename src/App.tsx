import { useEffect } from 'react'
import './App.css'

import { DB } from "./db";

import { ResumeProvider } from './context/resume/ResumeProvider'
import { ResumeView } from './components/ResumeView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CreateDemoResume } from './helpers/CreateDemoResume';

function App() {

  useEffect(() => {
      const init = async () => {
        await DB.ready;
        CreateDemoResume();
      }
      init();
    }, []
  )

 return (
    <ResumeProvider resumeId={1}>
        <Header />
        {/* <div className='flex flex-col flex-1 bg-cyan-500'>
hi
        </div> */}
        <ResumeView />
        <Footer />
    </ResumeProvider>
 )
}

export default App
