import { useEffect, useState } from "react";
import { ResumeSection } from "../types"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";

type DataItemDisplayProps = {
    data : any
    section_id : number
}

const DataItemDisplay = (props : DataItemDisplayProps) => {
    const {isOver, setNodeRef} = useDroppable({
        id: `dataitem-${props.section_id}`,
    });

    const [bgColor, setBGColor] = useState('bg-orange-500');

    useEffect(()=>{
        console.log("isOver " + isOver)
        isOver ? setBGColor('bg-green-800/80') : setBGColor('')
    },[isOver])

    return(
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
                console.log("data " + data)
                c.data = comp.data ? JSON.parse(data) : null
            }
           
            d.push(c)
        })
        setData(d)
    },[])

    return(
        <div className="flex flex-col items-start gap-4 bg-gray-300 p-4 rounded-lg">
            <h3 className="text-black text-lg">SectionType: {props.resumeSection.sectionType}</h3>
            <p className="text-black text-md">template:</p>
            <pre className="w-full bg-black">
                <SyntaxHighlighter language="latex" style={nord} >
                    {props.resumeSection.template?.content}
                </SyntaxHighlighter>
            </pre>
            <p className="text-black text-md">Data Items:</p>
            <DataItemDisplay data={data} section_id={props.resumeSection.id} />
        </div>
    )
}