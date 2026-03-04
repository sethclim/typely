import { Editor, Monaco } from '@monaco-editor/react'
import { useRouterState } from '@tanstack/react-router'
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useEffect, useState } from 'react';
import { mapRowToTemplate } from '../components/ComponentLibrary';
import { Template, Theme } from '../types';
import { myLang } from '../components/editor/monaco/latex';
import type * as monacoEditor from "monaco-editor";
import { useDataContext } from '../context/data/DataContext';

const mapThemeRowToTheme = (themeRow : {
    id: number;
    name: string | null;
    description: string | null;
    stySource: string | null;
    isSystem: boolean | null;
    ownerUserId: string | null;
    createdAt: string | null;
} | null) : Theme => {

  if (themeRow === null) throw Error("null themeRow")

  return {
    id: themeRow.id!,
    name: themeRow.name!,
    description: themeRow.description!,
    sty_source: themeRow.stySource!,
    is_system: themeRow.isSystem!,
    owner_user_id: themeRow.ownerUserId!,
    created_at: themeRow.createdAt!,
    templates: []
  }
}

function useSaveShortcut(onSave: () => void) {
  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
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

export type ThemeEditorProps = {
    themeId : string
}

export const ThemeEditor = (props : ThemeEditorProps) => {
 

    const [expanded, setExpanded] = useState(true);
    const [templates, setTemplates] = useState<Array<Template>>([]);
    const [theme, setTheme] = useState<Theme>();
    const [template, setTemplate] = useState<Template>();

    const [activeCode, setActiveCode]  = useState<ActiveCode>();
    const [activeChanges, setActiveChanges] = useState<string | null>(null);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const { location } = useRouterState();

    const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
    const isDemo = location.pathname.startsWith('/demo');
    const base = isDemo ? '/demo' : '/app';

    const inData = useDataContext();

    const saveChange = async() => {

        if(!activeChanges)
            return;

        if(activeCode?.type === CodeType.Template) {

          if(!template)
            return;
          
          console.log('Saving Template...');
          await inData.repositories.template.update(template.id, activeChanges)

        } else if(activeCode?.type === CodeType.Theme){

          if(!theme?.id)
            return;

          console.log('Saving Theme...');
          await inData.repositories.theme.update(theme.id, activeChanges)
        }

        setActiveChanges(null)
    }

    useSaveShortcut(saveChange);
    
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (activeChanges) {
          e.preventDefault();
          e.returnValue = '';
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [activeChanges]);
    
    const handleEditorChange = (text : string | undefined) => {
        if(text)
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
        monaco.editor.setModelLanguage(model, "latex");
      }
    }

    const fetchDataForLib = async () => {

        const data = inData.repositories.theme.get(parseInt(props.themeId))
        const theme = mapThemeRowToTheme(data)

        setTheme(theme)
        
        const templateData = inData.repositories.template.getByThemeId(theme.id);

        const hydratedTemplates = templateData.map(item => mapRowToTemplate(item))

        setTemplates(hydratedTemplates)

        if(hydratedTemplates.length > 0) {

          setTemplate(hydratedTemplates[0])

          setActiveCode({
            type: CodeType.Template,
            content: hydratedTemplates[0].content
          })
        }
    }

    useEffect(() => {

        fetchDataForLib();

        const unsubscribeTemplateTable =
            inData.repositories.template.subscribe(fetchDataForLib);

        const unsubscribeThemeTable =
            inData.repositories.theme.subscribe(fetchDataForLib);

        return () => {
            unsubscribeTemplateTable;
            unsubscribeThemeTable;
        };

    }, []);

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
          <div className='w-full flex justify-end items-center gap-4 pr-30'>

            <button
              onClick={saveChange}
              disabled={!activeChanges}
              className="text-grey hover:text-mywhite disabled:opacity-100 disabled:text-grey disabled:cursor-default"
            >
              SAVE
            </button>

            <button
              className="text-grey hover:text-mywhite"
              onClick={() => {
                if (activeChanges) {
                  setShowUnsavedDialog(true);
                } else {
                  window.location.href = base;
                }
              }}
            >
              BACK
            </button>

          </div>
        </Header>

        <div className='grow flex flex-row'>

            <Sidebar expanded={expanded}>

              <div>

                <h2 className='text-mywhite m-2'>CONFIG</h2>

                <div className='min-w-50 flex flex-col gap-2'>
                  <button
                    className='text-mywhite text-left p-2 bg-darker hover:bg-darkest hover:text-primary mx-2'
                    onClick={()=>onPickConfig(theme)}
                  >
                    config
                  </button>
                </div>

                <h2 className='text-mywhite m-2'>TEMPLATES</h2>

                <div className='min-w-50 flex flex-col gap-2'>                
                  {
                      templates.map(t => (
                        <button
                              key={t.id}
                              className='text-mywhite text-left p-2 bg-darker hover:bg-darkest hover:text-primary mx-2'
                              onClick={() => {
                                if (activeChanges) {
                                  setPendingTemplate(t);
                                  setShowUnsavedDialog(true);
                                } else {
                                  onPickTemplate(t);
                                }
                              }}
                          >
                          {t.name}
                        </button>
                      ))
                  }
                </div>

              </div>

            </Sidebar>

            <Editor
               height="h-full"
                   defaultLanguage="latex"
                   value={activeCode?.content}
                   theme="latex-dark"
                  onMount={handleEditorDidMount}
                   onChange={handleEditorChange}
              />

        </div>
{showUnsavedDialog && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-darkest p-6 rounded flex flex-col gap-4">
      <h2 className="text-mywhite text-lg">Unsaved Changes</h2>

      <p className="text-grey">
        You have unsaved changes. Leave without saving?
      </p>

            <div className="flex gap-4 justify-end">
              <button
                className="text-grey hover:text-mywhite"
                onClick={() => setShowUnsavedDialog(false)}
              >
                Cancel
              </button>

              <button
                className="text-red-400 hover:text-red-300"
                  onClick={() => {
                    if (pendingTemplate) {
                      onPickTemplate(pendingTemplate);
                      setPendingTemplate(null);
                      setShowUnsavedDialog(false);
                      setActiveChanges(null);
                    } else {
                      window.location.href = base;
                    }
                  }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}