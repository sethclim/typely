// import { useEffect, useState } from 'react'
// import './App.css'

// import { DB } from "./db";

// import { ResumeProvider } from './context/resume/ResumeProvider'
// import { ResumeView } from './components/ResumeView';
// import { Header } from './components/Header';
// import { Footer } from './components/Footer';
// import { CreateDemoResume } from './helpers/CreateDemoResume';
// import { Sidebar } from './components/Sidebar';
// import { ResumeConfigTable } from './db/tables';
// import { ResumeConfigRow } from './db/types';

// import { Auth } from "@supabase/auth-ui-react";
// import { User, createClient } from "@supabase/supabase-js";

// import { ThemeSupa } from "@supabase/auth-ui-shared";


// function App() {

//   const [user, setUser] = useState<User>();
//   const [activeId, setActiveId] = useState(1);
//   const [resumes, setResumes] = useState<ResumeConfigRow[]>([]);

//   useEffect(() => {
//       const init = async () => {
//         await DB.ready;
//         const rows = ResumeConfigTable.getResumeConfig(1);
//         if(rows.length == 0)
//           CreateDemoResume();


//         // Whenever the auth state changes, we receive an event and a session object.
//         // Save the user from the session object to the state.
//         supabase.auth.onAuthStateChange((event, session) => {
//           if (event === "SIGNED_IN") {
//             setUser(session?.user);
//           }
//         });
//       }
//       init();
//     }, []
//   )

//   const fetchResumes = () => {
//     const rows = ResumeConfigTable.getAllResumeConfig();
//     console.log("fetchResumes " + rows.length)
//     setResumes(rows)
//   }

//   useEffect(() => {
//       const init = async () => {
//         await DB.ready;
//         fetchResumes();
//       }
//     const unsubscribe = ResumeConfigTable.subscribe(fetchResumes);
//     init();
//     return () => unsubscribe();
//   }, []);



//  return (
//       user ? (
//       <>
//            <ResumeProvider resumeId={activeId}>
//             <Header />
//             <div className='flex flex-row'>
//               <Sidebar
//                 resumes={resumes}
//                 activeId={activeId}
//                 onSelect={setActiveId}
//               />
//               <ResumeView />
//             </div>
//             <Footer />
//         </ResumeProvider>
//       </>
//       )
//       : <LoggedOut />
//  )
// }

// function LoggedOut() {
//   return (
//     <Auth
//       supabaseClient={supabase}
//       appearance={{
//         theme: ThemeSupa,
//       }}
//       providers={[]}
//       theme="dark"
//       redirectTo="/"
//       showLinks
//     />
//   );
// }


// export default App
