import { useEffect, useState } from "react";
import { ResumeSection, Template } from "../types"
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";

type DataItemDisplayProps = {
    data : any
    section_id : number
}

const DataItemDisplay = (props : DataItemDisplayProps) => {
    const {isOver, setNodeRef, active} = useDroppable({
        id: `dataitem-${props.section_id}`,
    });

    const [bgColor, setBGColor] = useState('bg-orange-500');

    useEffect(()=>{
        (isOver && active?.id.toString().startsWith("dataitem-"))  ? setBGColor('bg-green-800/80') : setBGColor('')
    },[isOver])

    return(
        <>
            <p className="text-black text-md">Data Items:</p>
            <div ref={setNodeRef} className={clsx(["flex flex-col items-start w-full flex min-h-20", bgColor])}>
            {
                props.data?.map((component : any, index : number) => {
                    return (
                        <div key={index} className="flex flex-col items-start  w-200 flex ">
                            {/* <h1 className="text-black text-sm">{component.title}</h1> */}
                        {component.data && typeof component.data === "object" && !Array.isArray(component.data) ? (
                            Object.entries(component.data).map(([key, value]) => (
                                <div key={key} className="flex flex-row gap-4">
                                        <p  className="text-red">
                                            {key}
                                        </p>
                                        <p  className="text-black">
                                            {value as string}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-black">{component.data}</p>
                            )}
                        </div>
                    ) 
                })
            }
            </div>
        </>
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

    const [bgColor, setBGColor] = useState('bg-orange-500');

    useEffect(()=>{
        // console.log("isOver " + isOver)

        (isOver && active?.id.toString().startsWith("template-"))  ? setBGColor('bg-green-800/80') : setBGColor('')
    },[isOver])

    return (
        <>
            <p className="text-black text-md">template:</p>
            <div ref={setNodeRef} className={clsx(["w-full bg-black min-h-20 p-2", bgColor])}>
                <SyntaxHighlighter language="latex" style={nord} >
                    {props.template?.content}
                </SyntaxHighlighter>
            </div>
        </>
    )
}

type ResumeTemplateDisplayProps = {
    resumeSection : ResumeSection
}

export const ResumeTemplateDisplay = (props : ResumeTemplateDisplayProps) => {

    const [data, setData] = useState<any>()

    useEffect(()=>{
        const d : any = []
        props.resumeSection.items.map((comp)=>{
            let c = comp;
        
            if (comp.data != undefined && typeof comp?.data === "string"){
                let data = comp?.data.replace(/'/g, '"');
                // console.log("data " + data)
                c.data = comp.data ? JSON.parse(data) : null
            }
           
            d.push(c)
        })
        setData(d)
    }, [props.resumeSection.items])

    return(
        <div className="flex flex-col items-start gap-4 bg-gray-300 p-4 rounded-lg">
            <h3 className="text-black text-lg">SectionType: {props.resumeSection.sectionType}</h3>
            <TemplateItemDisplay template={props.resumeSection.template}  section_id={props.resumeSection.id} />
            <DataItemDisplay data={data} section_id={props.resumeSection.id} />
        </div>
    )
}