import { useEffect, useState } from "react"
import { ResumeDataItemTable, TemplateTable,  } from '../db/tables';
import { DataItemRow, TemplateRow } from "../db/types";
import { DB } from "../db";
import { DataItem, DataItemType, Template } from "../types";
import ThreeWaySlider from "./ThreeWaySlider";

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { useDraggable } from "@dnd-kit/core";
import { AddDetailsModal } from "./AddDataItemModal";
import { LatexEditor } from "./LatexEditor";

// type componentLibraryProps = {
//     // latex_comps : Array<Block>
// }

type DataItemsProps = {
    dataItem : DataItem
}

const DataItemComponent = (props : DataItemsProps) => {

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: `dataitem-${props.dataItem.id}`,
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return(
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div className="max-h-20 text-black text-ellipsis overflow-hidden bg-black/20 m-2">
                <h3 className="text-xl text-bold">{props.dataItem.title}</h3>
                <p className="max-h-40 text-ellipsis">{props.dataItem.data}</p>
            </div>
        </button>
    )
}

type TemplateItemComponentProps = {
    template: Template
}

const TemplateItemComponent = (props : TemplateItemComponentProps) => {

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id:  `template-${props.template.id}`,
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const [isOpen, setIsOpen] = useState(false);


    const edit = () => {
        console.log("EDIT")
        setIsOpen(true)
    }

    const saveChange = (text : string) => {
        console.log("saveChange")
        TemplateTable.update(props.template.id, text)
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div className="text-black text-ellipsis overflow-hidden bg-white/40">
                {/* <p>{JSON.stringify(template)}</p> */}
                <div className="flex flex-row gap-4 p-2">
                    <h3 className="text-xl text-bold">{props.template.name}</h3>
                    <button className="bg-black text-white px-2" onClick={() => edit()}>EDIT</button>
                </div>
                <SyntaxHighlighter language="latex" style={nord} >
                    {props.template.content}
                </SyntaxHighlighter>
                {/* <p className="max-h-40 text-ellipsis">{template.content}</p> */}
            </div>
            <LatexEditor isOpen={isOpen} setIsOpen={setIsOpen} latex={props.template.content} saveChange={saveChange} />
        </div>
    )
}

export function mapRowToDataItem(
    row: DataItemRow,
    // type: DataItemType
): DataItem {
   const d : DataItemType = {id: 14, name: "TODO"}
    return {
        id: row.id!,
        type:  d,
        title: row.title,
        description: row.description,
        data: row.data,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

export function mapRowToTemplate(
    row: TemplateRow,
): Template {
//    const d : DataItemType = {id: 14, name: "TODO"}
    return {
        id: row.id,
        name: row.name,
        sectionType: row.section_type,
        content: row.content,
        description: row.description,
    };
}


export const ComponentLibrary = () => {

    const [dataItems, setDataItems] = useState<Array<DataItem>>();
    const [templates, setTemplates] = useState<Array<Template>>();

    const [level, setLevel] = useState("DataItems");
    const [isOpen, setIsOpen] = useState(false);

    const fetchDataForLib = async () => {
        await DB.ready;
        const data = ResumeDataItemTable.getAll();
        const hydrated = data.map((item) => mapRowToDataItem(item))
        setDataItems(hydrated)

        const templateData = TemplateTable.getAll();
        const hydratedTemplate = templateData.map((item) => mapRowToTemplate(item))
        setTemplates(hydratedTemplate)
    }

    useEffect(() => {
            fetchDataForLib();
            const unsubscribe = ResumeDataItemTable.subscribe(fetchDataForLib);
            return () => unsubscribe();
        }, []
    )

    return (
        <div className="flex flex-col w-150">
            <h3 className="text-xl text-bold text-black">Component Library</h3>

            <ThreeWaySlider
                options={["DataItems", "Templates", "Instances"]}
                value={level}
                onChange={setLevel}
                className="w-full"
            />

            <div className="bg-black flex flex-row justify-between items-center p-2">
                <p className="text-white">Add Item</p>
                <button onClick={() => setIsOpen(true)}>Add</button>
            </div>
            {
                (level == "DataItems") ?  
                    (
                    <div className="flex flex-col gap-4">
                    {
                        dataItems?.map((data_item) => {
                            return (
                                <DataItemComponent key={data_item.id} dataItem={data_item} />
                            )
                        })
                    }
                    </div> 
                    )
                : null
            }
            {
                 (level == "Templates") ?  
                    <div className="flex flex-col gap-4">
                    {
                        templates?.map((template) => {
                            return <TemplateItemComponent template={template} />
                        })
                    }
                    </div> 
                : null
            }

            <AddDetailsModal isOpen={isOpen} setIsOpen={setIsOpen}  />
        </div>
    )
}
