import { Editor } from '@monaco-editor/react'
import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useState } from 'react';

export const Route = createFileRoute('/theme-editor')({
  component: RouteComponent,
})

function RouteComponent() {

    const [expanded, setExpanded] = useState(true);

    return (

        <>
            <Header expanded={expanded} setExpanded={setExpanded} />
            <div className='grow flex flex-row'>
                {/* <Sidebar
                    resumes={resumes}
                    activeId={activeId}
                    onSelect={setActiveId}
                    expanded={expanded}
                /> */}
                <Editor 
                    height="50vh" 
                    defaultLanguage="latex" 
                    value={"somecode"} 
                    defaultValue="// some comment"  
                    theme="vs-dark" 
                    // onChange={handleEditorChange}
                />
            </div>
            <Footer />
        </>
    )
}
