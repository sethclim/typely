import { createFileRoute } from '@tanstack/react-router'
import { Application } from '../components/Application';
import { useEffect } from 'react';
import { loadDemoFromJSON } from '../helpers/LoadDemoFromJSON';
import { CreateDemoResume } from '../helpers/CreateDemoResume';
import { useDataContext } from '../context/data/DataContext';
import { DataProvider } from '../context/data/DataProvider';

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {

  const {repositories, themes} = useDataContext();

  useEffect(() => {

    // console.log(themes)
    if (themes.length === 0) return;

    const info = loadDemoFromJSON(themes);
    CreateDemoResume(repositories, info, themes);
  }, [themes]);
  
  return (
    <DataProvider storageKey={'demoDb'} >
      <Application />;
    </DataProvider>
  )
}


