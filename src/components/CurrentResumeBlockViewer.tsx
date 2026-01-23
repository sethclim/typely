import { DragEndEvent, useDndMonitor } from "@dnd-kit/core";
import { ResumeConfig, ResumeSection } from "../types"
import { ResumeSectionCard } from "./ResumeTemplateDisplay";
import { useEffect, useState } from "react";
import { PencilIcon } from '@heroicons/react/20/solid';

import {
    arrayMove,
    SortableContext
} from '@dnd-kit/sortable';
import { RESUME_CONFIG_TABLE } from "../db/tables";
import { Link } from "@tanstack/react-router";
// import { useThemes } from "../context/themes/ThemesContext";
import { Dropdown } from "./Dropdown";
import { useDataContext } from "../context/data/DataContext";

export type CurrentResumeBlockViewerProps = {
    resume? : ResumeConfig | null,
    setIsNewRsumeOpen: (state : true) => void;
}

export const CurrentResumeBlockViewer = (props : CurrentResumeBlockViewerProps) => {

    const [sections, setSections] =  useState<ResumeSection[]>([])
    const [reordered, setReordered] = useState(false);

    const { repositories, dbService, themes } = useDataContext();

    useEffect(() => {
        if(props.resume?.sections != null) 
            setSections(props.resume!.sections)

    },[props.resume?.sections])

     useDndMonitor({
        onDragEnd(event) {
            reorderGamesList(event)
        },
    });

    const reorderGamesList = (e: DragEndEvent) => {
        if (!e.over) return;

        if (sections == null) return;

        const [overPrefix, over_id] = e.over.id.toString().split('-');
        const [activePrefix, active_id] = e.active.id.toString().split('-');

        if (overPrefix !== "section" || activePrefix !== "section" || over_id === "" || active_id === "")
            return

        if (over_id !== active_id) {
            setSections((sections) => {
                const oldIdx = sections.findIndex(s => s.id === parseInt(active_id));
                const newIdx = sections.findIndex(s => s.id === parseInt(over_id));
                return arrayMove(sections, oldIdx, newIdx);
            });

            setReordered(true);
        }   
    };

    useEffect(() => {
        if (reordered) {
            sections.forEach((section, index) => {
                repositories.resumeSectionConfig.updateOrder(section.id, index);
            });

            // Reset the flag
            setReordered(false);
        }
    }, [sections, reordered]);

    // const { themes } = useThemes()

    const [activeTheme, setActiveTheme] = useState("")

    useEffect(()=>{
        if(props.resume)
            setActiveTheme(props.resume.theme.name)
    },[props.resume])

    const changeThemeForResume = (newThemeName: string | null) => {
        console.log("newTheme " + newThemeName)
        if(!newThemeName || !props.resume)
            return

        setActiveTheme(newThemeName)


        // console.log("@themes " + JSON.stringify(themes))

        const newTheme = themes.filter(t => t.name === newThemeName.toLowerCase())[0]

        console.log("@newTheme " + JSON.stringify(newTheme))

        // Change resume config theme
        // change sections to point to right template from new theme

        repositories.resumeConfig.updateTheme({
            id: props.resume.id, 
            themeId: newTheme.id, 
            updatedAt: Date.now().toString(),
            notify: false
        })
        
        props.resume?.sections.forEach(section => {

            console.log("section.sectionType " + section.sectionType)
            
            const newTemplateForSection = newTheme.templates.filter(t => t.sectionType === section.sectionType)[0]
            console.log("@newTemplateForSection " + JSON.stringify(newTemplateForSection))
            
            repositories.resumeSectionConfig.updateTemplate(section.id, newTemplateForSection.id, false)
        })
        dbService.notifyTable(RESUME_CONFIG_TABLE)
    }



    return (
        <div className='flex flex-col gap-4 p-4'>
            <h4 className='text-white text-lg font-bold'>Resume Blocks</h4>
            <div className="flex flex-row  p-2 bg-dark m-2 overflow-hidden">
                <div className="w-full flex flex-row justify-start items-center gap-2 text-grey" > 
                    <p className="">Theme:</p>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <Dropdown 
                            options={["Engineering", "Colorful", "Faang"]} 
                            selected={activeTheme} 
                            onSelected={(v) => changeThemeForResume(v)} />
                        {
                            props?.resume?.theme ? 
                            <Link   to="/theme-editor/$themeId"
                                    params={{ themeId: props.resume.theme.id.toString() }} >
                                <PencilIcon className="h-4 w-4 text-grey hover:text-mywhite cursor-pointer" />
                            </Link> : null
                        }
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <button className='bg-darker text-grey rounded-lg w-30 p-2 m-2' onClick={() => props.setIsNewRsumeOpen(true)}>Add Block +</button>
                </div>
            </div>
            <div className='flex flex-col gap-4 bg-darkest p-2'>
            {
                props.resume && 
                    <SortableContext items={sections.map((x) => `section-${x.id}`)} >
                    {
                        sections.map((section) => {
                            return (
                                <>
                                    <ResumeSectionCard key={section.id} resumeSection={section}  /> 
                                </>
                            )
                        })
                    }
                    </SortableContext>
            }
            </div>
        </div>
    )
}