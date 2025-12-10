import { DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { ResumeConfig, ResumeSection } from "../types"
import { ResumeSectionCard } from "./ResumeTemplateDisplay";
import clsx from "clsx";
import { useEffect, useState } from "react";

import {
    arrayMove,
  SortableContext
} from '@dnd-kit/sortable';
import { ResumeSectionConfigTable } from "../db/tables";

export type CurrentResumeBlockViewerProps = {
    resume? : ResumeConfig | null,
    setIsNewRsumeOpen: (state : true) => void;
}

type ListDroppableProps = {
    id : number
}

const ListDroppable = ({id} : ListDroppableProps) => {

    const {isOver, setNodeRef, active} = useDroppable({
        id: `section-${id}`,
    });

    const [bgColor, setBGColor] = useState('');

    useEffect(()=>{
        console.log("active?.id " + active?.id);
        (isOver && active?.id.toString().startsWith("section-"))  ? setBGColor('bg-green-900') : setBGColor('bg-gray-200')
    },[isOver])

    return(
        <div ref={setNodeRef} className="flex justify-center items-center my-2 h-6">
            <div className={clsx(["w-full h-1", bgColor])}></div>
        </div>
    )
}

export const CurrentResumeBlockViewer = (props : CurrentResumeBlockViewerProps) => {

    const [sections, setSections] =  useState<ResumeSection[]>([])
    const [reordered, setReordered] = useState(false);

    useEffect(() => {
        if(props.resume?.sections != null) 
        {
            const copy = [...props.resume?.sections]
            copy.sort((a, b) => a.order - b.order);
            console.log(`copy ${copy.length}`)
            setSections(copy)
        }
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
            <h4 className='text-white text-lg font-bold'>Resume Components</h4>
            <div className='flex flex-col gap-4'>
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
            <button className='bg-white text-black rounded-lg' onClick={() => props.setIsNewRsumeOpen(true)}>Add New Component +</button>
        </div>
    )
}