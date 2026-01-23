import { createFileRoute } from '@tanstack/react-router'
import ResumeStylePicker from '../../components/ResumeStylePicker'
import { useEffect, useState } from 'react'
import { ResumeIntakeForm } from '../../components/ResumeIntakeForm'
// import { DB } from '../db'

import { Template, Theme } from '../../types'
import { TemplateRow } from '../../db/types'
import { useDataContext } from '../../context/data/DataContext'
// import { DataProvider } from '../context/data/DataProvider'

export const Route = createFileRoute('/_app/onBoarding')({
  component: RouteComponent,
})

// ThemeThemeDataRowWithTemplates TODO
const hydrateThemes = (rows : Array<any>) : Array<Theme> => {
    if (!rows || rows.length === 0) return [];

    const res = rows.map(themeRow => {
        

        const templates = JSON.parse(themeRow.templates) as TemplateRow[]
        console.log(JSON.stringify(templates))

        const t : Theme = {
            id: themeRow.id!,
            name: themeRow.name!,
            description: themeRow.description!,
            sty_source: themeRow.sty_source,
            is_system: themeRow.is_system,
            owner_user_id: themeRow.owner_user_id,
            created_at: themeRow.created_at,
            templates: templates.map(templateRow => {
                const template : Template = {
                    id: templateRow.id!,
                    name: templateRow.name,
                    sectionType: templateRow.section_type,
                    content: templateRow.content
                }
                return template
            })
        } 

        return t
    })

  return res
}

function RouteComponent() {
    const [selected, setSelected] = useState<Theme | null>(null)
    const [stage, setStage] = useState(0)
    const [themes, setThemes] = useState<Array<Theme>>([])

    const {repositories} = useDataContext()

    const onSelect = (theme : Theme) => {
        setSelected(theme)
    }

    useEffect(() => {
        const init = async () => {
            // await DB.ready;
            const rows = repositories.theme.getAll();
            const themes = hydrateThemes(rows)
            if(themes.length > 0)
                setThemes(themes)
        }
        // const unsubscribe = ResumeConfigTable.subscribe(fetchResumes);
        init();
        // return () => unsubscribe();
    }, []);

    return (
            <div className='flex flex-col justify-center  items-center grow'>
                <div className='w-full'>
                    {
                        stage == 0 ? (
                            <>
                                <ResumeStylePicker onSelect={onSelect} themes={themes} /> 
                                <div className='w-full h-full flex flex-row justify-center'>
                                {
                                    selected ? <button id="onboarding-next" className='bg-primary/80 px-4 py-2 text-white text-lg rounded-sm hover:bg-primary' onClick={() => setStage(1)}>NEXT</button> : null
                                }
                                </div>
                            </>
                        ) : null
                    }
                    {
                        (stage == 1 && selected) ? <ResumeIntakeForm theme={selected}  /> : null
                    }
                </div>
            </div>
    )
}
