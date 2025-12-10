import { useEffect, useState } from "react";
import { DataItem, ResumeSection, Template } from "../types"
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useDraggable, useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { Toggle } from "./Toggle";
import GroupedTable from "./GroupedDataTable";
import { ResumeSectionDataTable } from "../db/tables";
import { GrabHandle } from "./GrabHandle";
// import { Draggable } from "./Draggable";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import { SectionContextMenu } from "./SectionContextMenu";

type DataItemDisplayProps = {
    data : DataItem[]
    section_id : number
}

const DataItemDisplay = (props : DataItemDisplayProps) => {
    const {isOver, setNodeRef, active} = useDroppable({
        id: `dataitem-${props.section_id}`,
        data: props.data
    });

    const [bgColor, setBGColor] = useState('');

    useEffect(()=>{
        (isOver && active?.id.toString().startsWith("dataitem-"))  ? setBGColor('bg-green-900') : setBGColor('')
    },[isOver])

    const RemoveDataItemFromResume = (data_item_id : number) =>{
        ResumeSectionDataTable.delete({section_id : props.section_id,  data_item_id : data_item_id})
    }

    return(
        <div ref={setNodeRef} className="flex flex-col w-full items-start justify-start  min-h-5 pt-2">
            <Toggle 
                buttonStyle={clsx(["flex justify-between items-center px-2 py-1 text-sm font-medium text-left text-white bg-black rounded-sm ", bgColor])}
                panelStyle={clsx(["pt-4 bg-black p-2 ", bgColor])}
                barContents={
                    <p className="text-white text-md font-bold">Data Items: ({props.data? props.data.length : 0})</p>
                }>
                <GroupedTable dataItems={props.data} onRemove={RemoveDataItemFromResume} />
            </Toggle>
        </div>
    )
}

type TemplateItemDisplayProps = {
    template : Template | undefined
    section_id : number
}

const TemplateItemDisplay = (props : TemplateItemDisplayProps) => {
    const {isOver, setNodeRef, active} = useDroppable({
        id: `template-${props.section_id}`,
        data: props.template
    });

    const [bgColor, setBGColor] = useState('');

    useEffect(()=>{
        (isOver && active?.id.toString().startsWith("template-"))  ? setBGColor('bg-green-900 ') : setBGColor('')
    },[isOver])

    return (
        <div ref={setNodeRef} className="flex flex-col w-full items-start justify-start min-h-5 pt-2">
            <Toggle 
                buttonStyle={clsx(["flex justify-between items-center px-2 py-1 text-sm font-medium text-left text-white bg-black rounded-sm ", bgColor])}
                panelStyle={clsx(["pt-4 bg-black p-2 ", bgColor])}
                barContents={
                    <div className="flex flex-row">
                        <p className="text-white text-md font-bold mr-2">Template:</p>
                        <p className="text-white text-md">{props.template?.name}</p>
                    </div>
                }
            >
                <SyntaxHighlighter className="text-left" language="latex" style={atomOneDark} >
                    {props.template?.content}
                </SyntaxHighlighter>
            </Toggle>
        </div>
    )
}

type ResumeTemplateDisplayProps = {
    resumeSection : ResumeSection
}

export const ResumeSectionCard = (props : ResumeTemplateDisplayProps) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: `section-${props.resumeSection.id}`, data: props.resumeSection});


    return(
        // <Draggable dragId={`section-${props.resumeSection.id}`} data={props.resumeSection}>
        <div className="flex flex-row min-w-80 w-full items-center bg-white p-2 rounded-lg" ref={setNodeRef} {...listeners} {...attributes}  style={{
            transform: CSS.Transform.toString(transform),
            transition: transition
        }}>
            <div className="flex flex-col grow">
                <div className="flex flex-row w-full">
                    <div className="grow w-full flex">
                        <div className="flex flex-row relative">
                            <h3 className="text-black text-lg">{props.resumeSection.title}</h3>
                            <SectionContextMenu section_id={props.resumeSection.id} />
                        </div>
                    </div>
                    <div className="inline-flex items-center px-1 rounded-sm bg-blue-900/80 text-neutral-200 text-xs">
                        {props.resumeSection.sectionType}
                    </div>
                </div>
                <TemplateItemDisplay template={props.resumeSection.template}  section_id={props.resumeSection.id} />
                <DataItemDisplay data={props.resumeSection.items} section_id={props.resumeSection.id} />
            </div>
            <div className="pl-2">
                <GrabHandle dotColor="bg-gray-500" />
            </div>
        </div>
        // </Draggable>
    )
}
