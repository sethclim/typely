import { useEffect, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { Application } from '../../components/Application';
import { loadDemoFromJSON } from '../../helpers/LoadDemoFromJSON';
import { CreateDemoResume } from '../../helpers/CreateDemoResume';
import { useDataContext } from '../../context/data/DataContext';


export const Route = createFileRoute('/demo/')({
  component: RouteComponent,
})

function RouteComponent() {

  const {repositories, themes} = useDataContext();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    if (themes.length === 0) return;

    hasRunRef.current = true;
    const info = loadDemoFromJSON(themes);
    CreateDemoResume(repositories, info, themes);
  }, [themes, repositories]);
  
  return <Application />;
  
}


