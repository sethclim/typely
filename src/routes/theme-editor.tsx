import { Editor, Monaco } from '@monaco-editor/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useEffect, useState } from 'react';
import { mapRowToTemplate } from '../components/ComponentLibrary';
import { Template, Theme } from '../types';
import { TemplateTable, ThemeTable } from '../db/tables';
import { DB } from '../db';
import { myLang } from '../components/editor/monaco/latex';
import type * as monacoEditor from "monaco-editor";
import { ThemeDataRow } from '../db/types';


const mapThemeRowToTheme = (themeRow : ThemeDataRow) : Theme => {
  const t : Theme = {
    id: themeRow.id!,
    name: themeRow.name,
    description: themeRow.description,
    sty_source: themeRow.sty_source,
    is_system: themeRow.is_system,
    owner_user_id: themeRow.owner_user_id,
    created_at: themeRow.created_at,
  }
  return t
}

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

enum CodeType {
  Theme,
  Template
}

type ActiveCode = {
  type: CodeType,
  content: string
}

function RouteComponent() {
    const [expanded, setExpanded] = useState(true);
    const [templates, setTemplates] = useState<Array<Template>>();
    const [theme, setTheme] = useState<Theme>();
    const [template, setTemplate] = useState<Template | undefined>(undefined)

    const [activeCode, setActiveCode]  = useState<ActiveCode | undefined>(undefined)
    const [activeChanges, setActiveChanges] = useState<string | undefined>(undefined)

    const saveChange = () => {
        if(!activeChanges)
          return

        if(activeCode?.type === CodeType.Template)
        {
          if(!template)
            return
          
          console.log('Saving Template...');
          TemplateTable.update(template.id, activeChanges)
        }
        else if(activeCode?.type === CodeType.Theme){
          if(!theme?.id)
            return
          console.log('Saving Theme...');
          ThemeTable.update(theme.id, activeChanges)
        }
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


        const theme = mapThemeRowToTheme(ThemeTable.get(0)[0])
        setTheme(theme)


        setTemplates(hydratedTemplates)
        if(hydratedTemplates.length > 0)
        {
          setTemplate(hydratedTemplates[0])
          setActiveCode({
            type: CodeType.Template,
            content: hydratedTemplates[0].content
          })
        }
    }

    useEffect(() => {
            fetchDataForLib();
            const unsubscribeTemplateTable = TemplateTable.subscribe(fetchDataForLib);
            const unsubscribeThemeTable = ThemeTable.subscribe(fetchDataForLib);
            return () => {
                unsubscribeTemplateTable();
                unsubscribeThemeTable();
            };
        }, []
    )

    const onPickTemplate = (template : Template) => {
      setTemplate(template)
      setActiveCode({
        type: CodeType.Template,
        content: template.content
      })
    }

    const onPickConfig = (theme : Theme | undefined) => {
      if(!theme)
        return
      setActiveCode({
        type: CodeType.Theme,
        content: theme.sty_source
      })
    }

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
                  <div>
                    <h2 className='text-mywhite m-2'>CONFIG</h2>
                      <div className='min-w-50 flex flex-col gap-2'>
                        <button className='text-mywhite text-left p-2 bg-darker hover:bg-darkest hover:text-primary mx-2' onClick={()=>onPickConfig(theme)} >config</button>
                      </div>
                    <h2 className='text-mywhite m-2'>TEMPLATES</h2>
                    <div className='min-w-50 flex flex-col gap-2'>                
                      {
                          templates?.map(t => (
                              <button className='text-mywhite text-left p-2 bg-darker hover:bg-darkest hover:text-primary mx-2' onClick={() => onPickTemplate(t)}>{t.name}</button>
                          ))
                      }
                    </div>
                  </div>
                </Sidebar>
                <Editor 
                  height="h-full" 
                  defaultLanguage="latex" 
                  value={activeCode?.content} 
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
