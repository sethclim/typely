import { useEffect, useState } from "react";
import { DataItem, ResumeSection, Template } from "../types"
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { Toggle } from "./Toggle";
import GroupedTable from "./GroupedDataTable";
import { ResumeSectionDataTable } from "../db/tables";

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
        (isOver && active?.id.toString().startsWith("dataitem-"))  ? setBGColor('outline-2 outline-solid outline-green-100') : setBGColor('')
    },[isOver])

    const RemoveDataItemFromResume = (data_item_id : number) =>{
        ResumeSectionDataTable.delete({section_id : props.section_id,  data_item_id : data_item_id})
    }

    return(
        <div ref={setNodeRef} className={clsx(["flex flex-col w-full items-start justify-start  min-h-5 pt-2", bgColor])}>
            <Toggle barContents={
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
        (isOver && active?.id.toString().startsWith("template-"))  ? setBGColor('outline-2 outline-solid outline-green-100 ') : setBGColor('')
    },[isOver])

    return (
        <div ref={setNodeRef} className={clsx(["flex flex-col w-full items-start justify-start min-h-5 pt-2", bgColor])}>
            <Toggle barContents={
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

export const ResumeTemplateDisplay = (props : ResumeTemplateDisplayProps) => {
    return(
        <div className="flex flex-col w-full items-start bg-white p-4 rounded-lg">
            <div className="flex flex-row w-full">
                <div className="grow w-full flex">
                    <h3 className="text-black text-lg">{props.resumeSection.title}</h3>
                </div>
                <div className="inline-flex items-center px-1 rounded-sm bg-blue-900/80 text-neutral-200 text-xs">
                    {props.resumeSection.sectionType}
                </div>
            </div>
            <TemplateItemDisplay template={props.resumeSection.template}  section_id={props.resumeSection.id} />
            <DataItemDisplay data={props.resumeSection.items} section_id={props.resumeSection.id} />
        </div>
    )
}
