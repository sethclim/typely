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

type DataItemDisplayProps = {
    data : DataItem[]
    section_id : number
}

const DataItemDisplay = (props : DataItemDisplayProps) => {
    const {isOver, setNodeRef, active} = useDroppable({
        id: `dataitem-${props.section_id}`,
    });

    const [bgColor, setBGColor] = useState('');

    useEffect(()=>{
        (isOver && active?.id.toString().startsWith("dataitem-"))  ? setBGColor('outline-2 outline-solid outline-green-100') : setBGColor('')
    },[isOver])

    return(
        <div ref={setNodeRef} className={clsx(["flex flex-col w-full items-start justify-start  min-h-5 pt-2", bgColor])}>
            <Toggle barContents={
                <p className="text-white text-md font-bold">Data Items: ({props.data? props.data.length : 0})</p>
            }>
                <GroupedTable dataItems={props.data} />
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
    });

    const [bgColor, setBGColor] = useState('');

    useEffect(()=>{
        (isOver && active?.id.toString().startsWith("template-"))  ? setBGColor('tline-2 outline-solid outline-green-100 ') : setBGColor('')
    },[isOver])

    return (
        <div ref={setNodeRef} className={clsx(["flex flex-col w-full items-start justify-start  min-h-5 pt-2", bgColor])}>
            <Toggle barContents={
                <div className="flex flex-row">
                    <p className="text-white text-md font-bold mr-2">Template:</p>
                    <p className="text-white text-md">{props.template?.name}</p>
                </div>
            }
            >

                    <SyntaxHighlighter language="latex" style={atomOneDark} >
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
            <h3 className="text-black text-lg ">Title: {props.resumeSection.id}</h3>
            <h3 className="text-black">Type: {props.resumeSection.sectionType}</h3>
            <TemplateItemDisplay template={props.resumeSection.template}  section_id={props.resumeSection.id} />
            <DataItemDisplay data={props.resumeSection.items} section_id={props.resumeSection.id} />
        </div>
    )
}