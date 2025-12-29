import { Editor, Monaco } from '@monaco-editor/react'
import { createFileRoute } from '@tanstack/react-router'
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

function RouteComponent() {

    const [expanded, setExpanded] = useState(true);

    const [templates, setTemplates] = useState<Array<Template>>();

    const [code, setCode] = useState<string | undefined>(undefined)

    // const monaco = useMonaco();

    function handleEditorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor , monaco: Monaco) {
  
      monaco.languages.setMonarchTokensProvider("latex", myLang);
      monaco.editor.defineTheme("latex-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword.command", foreground: "C586C0" },
          { token: "string.math", foreground: "4EC9B0" },
          { token: "comment", foreground: "6A9955" },
          { token: "delimiter.brace", foreground: "D4D4D4" },
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
                    height="h-full" 
                    defaultLanguage="latex" 
                    // value={code} 
                    defaultValue="% some comment\n\\section{Hello $x^2$}"
                    theme="latex-dark"
                    onMount={handleEditorDidMount}
                    // onChange={handleEditorChange}
                />
            </div>
            <Footer />
        </>
    )
}
