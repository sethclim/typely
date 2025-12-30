import { Editor, Monaco } from '@monaco-editor/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useEffect, useState } from 'react';
import { mapRowToTemplate } from '../components/ComponentLibrary';
import { Template } from '../types';
import { TemplateTable } from '../db/tables';
import { DB } from '../db';
import { myLang } from '../components/editor/monaco/latex';
import type * as monacoEditor from "monaco-editor";

export const Route = createFileRoute('/theme-editor')({
  component: RouteComponent,
})

function useSaveShortcut(onSave: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // For Windows/Linux: ctrlKey + 's'
      // For Mac: metaKey (Cmd) + 's'
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // Prevent the browser's save dialog
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave]);
}

function RouteComponent() {

    const [expanded, setExpanded] = useState(true);

    const [templates, setTemplates] = useState<Array<Template>>();

    const [template, setTemplate] = useState<Template | undefined>(undefined)
    const [activeChanges, setActiveChanges] = useState<string | undefined>(undefined)

    
    const saveChange = () => {
        if(!template || !activeChanges)
          return
        console.log('Saving...');
        TemplateTable.update(template.id, activeChanges)
    }

    useSaveShortcut(saveChange);

    const handleEditorChange = (text : string | undefined) => {
        setActiveChanges(text)
    }


    function handleEditorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor , monaco: Monaco) {
  
      monaco.languages.register({ id: "latex" });
      monaco.languages.setMonarchTokensProvider("latex", myLang);
      monaco.editor.defineTheme("latex-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword.command", foreground: "C586C0" },
          { token: "string.math", foreground: "4EC9B0" },
          { token: "comment", foreground: "6A9955" },
          { token: "delimiter.brace", foreground: "D4D4D4" },
          { token: "placeholder", foreground: "FF9E64", fontStyle: "bold underline" },
        ],
        colors: {
          "editor.background": "#0F1117",
          "editor.foreground": "#D4D4D4",
        },
      });


      monaco.editor.setTheme("latex-dark");

      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, "latex"); // rebind
      }
    }



    const fetchDataForLib = async () => {
        await DB.ready;
       
        const templateData = TemplateTable.getAll();
        const hydratedTemplates = templateData.map((item) => mapRowToTemplate(item))
        setTemplates(hydratedTemplates)
        if(hydratedTemplates.length > 0)
          setTemplate(hydratedTemplates[0])
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
            <Header expanded={expanded} setExpanded={setExpanded} >
              <div className='w-full flex justify-end items-center pr-30'>
                <Link to="/app">
                  <a className='text-grey hover:text-mywhite'>BACK</a>
                </Link>
              </div>
            </Header>
            <div className='grow flex flex-row'>
                <Sidebar
                    expanded={expanded}
                >
                  <div className='min-w-50 flex flex-col gap-2'>
                    {
                        templates?.map(t => (
                            <button className='text-mywhite text-left p-2 bg-darker hover:bg-darkest hover:text-primary mx-2' onClick={() => setTemplate(t)}>{t.name}</button>
                        ))
                    }
                  </div>
                </Sidebar>
                <Editor 
                  height="h-full" 
                  defaultLanguage="latex" 
                  value={template?.content} 
                  // defaultValue="% some comment\n\\section{Hello $x^2$}"
                  theme="latex-dark"
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                />
            </div>
            <Footer />
        </>
    )
}
