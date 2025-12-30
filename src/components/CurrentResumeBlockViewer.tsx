import { DragEndEvent, useDndMonitor } from "@dnd-kit/core";
import { ResumeConfig, ResumeSection } from "../types"
import { ResumeSectionCard } from "./ResumeTemplateDisplay";
import { useEffect, useState } from "react";

import { PencilIcon } from '@heroicons/react/20/solid';

import {
    arrayMove,
    SortableContext
} from '@dnd-kit/sortable';
import { ResumeSectionConfigTable } from "../db/tables";
import { Link } from "@tanstack/react-router";

export type CurrentResumeBlockViewerProps = {
    resume? : ResumeConfig | null,
    setIsNewRsumeOpen: (state : true) => void;
}

export const CurrentResumeBlockViewer = (props : CurrentResumeBlockViewerProps) => {

    const [sections, setSections] =  useState<ResumeSection[]>([])
    const [reordered, setReordered] = useState(false);

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
                ResumeSectionConfigTable.updateOrder(section.id.toString(), index);
            });

            // Reset the flag
            setReordered(false);
        }
    }, [sections, reordered]);

    return (
        <div className='flex flex-col gap-4 p-4'>
            <h4 className='text-white text-lg font-bold'>Resume Blocks</h4>
            <div className="flex flex-row  p-2 bg-dark m-2">
                <div className="w-full flex flex-row justify-start items-center gap-2 text-grey" > 
                    <p className="">Theme:</p>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <h4 className="">Engineering</h4>
                        <Link to="/theme-editor">
                            <PencilIcon className="h-4 w-4 text-grey hover:text-mywhite cursor-pointer" />
                        </Link>
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