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
            <p className="text-black text-md font-bold">Data Items: ({props.data? props.data.length : 0})</p>
            {
                <GroupedTable dataItems={props.data} />
               
            }
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
        // console.log("isOver " + isOver)

        (isOver && active?.id.toString().startsWith("template-"))  ? setBGColor('tline-2 outline-solid outline-green-100 ') : setBGColor('')
    },[isOver])

    return (
        <div ref={setNodeRef} className={clsx(["flex flex-col w-full items-start justify-start  min-h-5 pt-2", bgColor])}>
            <div className="flex flex-row">
                <p className="text-black text-md font-bold mr-2">Template:</p>
                <p className="text-black text-md">{props.template?.name}</p>
            </div>
            <Toggle text="Show Template">

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

    // const [data, setData] = useState<any>()

    // useEffect(()=>{
    //     const d : any = []
    //     props.resumeSection.items.map((comp)=>{
    //         let c = comp;
        
    //         if (comp.data != undefined && typeof comp?.data === "string"){
    //             let data = comp?.data.replace(/'/g, '"');
    //             // console.log("data " + data)
    //             c.data = comp.data ? JSON.parse(data) : null
    //         }
           
    //         d.push(c)
    //     })
    //     setData(d)
    // }, [props.resumeSection.items])

    return(
        <div className="flex flex-col w-full items-start bg-white p-4 rounded-lg">
            <h3 className="text-black text-lg ">Title: {props.resumeSection.id}</h3>
            <h3 className="text-black">Type: {props.resumeSection.sectionType}</h3>
            <TemplateItemDisplay template={props.resumeSection.template}  section_id={props.resumeSection.id} />
            <DataItemDisplay data={props.resumeSection.items} section_id={props.resumeSection.id} />
        </div>
    )
}