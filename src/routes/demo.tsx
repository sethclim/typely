import { createFileRoute } from '@tanstack/react-router'
import { Application } from '../components/Application';
import { DB } from '../db';
import { useEffect, useRef } from 'react';
import { loadDemoFromJSON } from '../helpers/LoadDemoFromJSON';
import { useThemes } from '../context/themes/ThemesContext';
import { CreateDemoResume } from '../helpers/CreateDemoResume';

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {

  const { themes } = useThemes()

  const didInit = useRef(false);
  
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    DB.init("demoDb");
    
    return () => {
      // On leave demo page
      DB.changeDB("myDb");
      localStorage.removeItem("demoDb");
    };
  }, []);

  useEffect(() => {

    console.log(themes)
    if (themes.length === 0) return;

    const info = loadDemoFromJSON(themes);
    CreateDemoResume(info, themes);
  }, [themes]);

  // if (!DB.ready) return null;
  
  return <Application />;
}


