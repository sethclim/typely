import { Editor } from '@monaco-editor/react'
import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useEffect, useState } from 'react';
import { mapRowToTemplate } from '../components/ComponentLibrary';
import { Template } from '../types';
import { TemplateTable } from '../db/tables';
import { DB } from '../db';

export const Route = createFileRoute('/theme-editor')({
  component: RouteComponent,
})

function RouteComponent() {

    const [expanded, setExpanded] = useState(true);

    const [templates, setTemplates] = useState<Array<Template>>();

    const [code, setCode] = useState<string | undefined>(undefined)


    const fetchDataForLib = async () => {
        await DB.ready;
       
        const templateData = TemplateTable.getAll();
        const hydratedTemplate = templateData.map((item) => mapRowToTemplate(item))
        setTemplates(hydratedTemplate)
    }

    useEffect(() => {
            fetchDataForLib();
            const unsubscribeTemplateTable = TemplateTable.subscribe(fetchDataForLib);
            return () => {
                unsubscribeTemplateTable();
            };
        }, []
    )

    return (

        <>
            <Header expanded={expanded} setExpanded={setExpanded} />
            <div className='grow flex flex-row'>
                <Sidebar
                    expanded={expanded}
                >
                    {
                        templates?.map(t => (
                            <button className='text-mywhite' onClick={() => setCode(t.content)}>{t.name}</button>
                        ))
                    }
                </Sidebar>
                <Editor 
                    height="50vh" 
                    defaultLanguage="latex" 
                    value={code} 
                    defaultValue="// some comment"  
                    theme="vs-dark" 
                    // onChange={handleEditorChange}
                />
            </div>
            <Footer />
        </>
    )
}
