import { useEffect, useState } from "react"
import { ResumeDataItemTable, TemplateTable,  } from '../db/tables';
import { DataItemRow, TemplateRow } from "../db/types";
import { DB } from "../db";
import { DataItem, DataItemType, Template } from "../types";
import ThreeWaySlider from "./ThreeWaySlider";

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { AddDetailsModal } from "./AddDataItemModal";
import { LatexEditor } from "./LatexEditor";
import { AddTemplateModal } from "./AddTemplateModal";
import { Draggable } from "./Draggable";

// type componentLibraryProps = {
//     // latex_comps : Array<Block>
// }

export type DataItemsProps = {
    dataItem : DataItem
}

export const DataItemComponent = (props : DataItemsProps) => {
    return(
        <div className="flex flex-col items-start p-2 text-black text-ellipsis overflow-hidden bg-black mt-2">
            <h3 className="text-white text-xl text-bold">{props.dataItem.title}</h3>
            {
                (props.dataItem.data !== null) ? (
                    <table className="min-w-full divide-y divide-white border border-white">
                        <thead className="">
                            <tr>
                            <th className="px-2 py-2 text-left font-medium text-white">Key</th>
                            <th className="px-2 py-2 text-left font-medium text-white">Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-white border border-white">
                          {props.dataItem.data.map(([key, value]) => (
                            <tr key={key} className="hover:bg-gray-50">
                                <th className="px-2 py-2 text-left font-medium text-gray-700">{key}</th>
                                <td className="px-2 py-2 text-left text-gray-900">{value}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    // <p className="text-white max-h-40 text-ellipsis">{props.dataItem.data}</p>
                ):null
            }
        </div>
    )
}


type TemplateItemComponentProps = {
    template: Template
}

const TemplateItemComponent = (props : TemplateItemComponentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dragId =`template-${props.template.id}`

    const edit = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        console.log("EDIT")
        setIsOpen(true)
    }

    const saveChange = (text : string) => {
        console.log("saveChange")
        TemplateTable.update(props.template.id, text)
    }

    return (
    
        <div className="p-2 bg-black my-2">
            <div className="text-black text-ellipsis overflow-hidden ">
                {/* <p>{JSON.stringify(template)}</p> */}
                <div className="flex flex-row gap-4 p-2">
                    <h3 className="text-xl text-bold text-white">{props.template.name}</h3>
                    <button className="bg-white text-black px-2" onClick={(e) => edit(e)}>EDIT</button>
                </div>
                <Draggable<Template> dragId={dragId} data={props.template} >
                    <SyntaxHighlighter className="z-50" language="latex" style={atomOneDark} >
                        {props.template.content}
                    </SyntaxHighlighter>
                </Draggable>
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
        data: row.data ? JSON.parse(row.data) : [],
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

export function mapRowToTemplate(
    row: TemplateRow,
): Template {
//    const d : DataItemType = {id: 14, name: "TODO"}
    return {
        id: row.id!,
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
    const [isDataItemModalOpen, setIsOpenDataItemModal] = useState(false);
    const [isTemplateModalOpen, setIsOpenTemplateModal] = useState(false);

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

            {
                (level == "DataItems") ?  
                    (
                        <>
                            <div className="bg-black flex flex-row justify-between items-center p-2">
                                <p className="text-white">Add Item</p>
                                <button onClick={() => setIsOpenDataItemModal(true)}>Add</button>
                            </div>
                            <div className="flex flex-col gap-1">
                            {
                                dataItems?.map((data_item) => {
                                    return (
                                        <Draggable key={data_item.id} dragId={`dataitem-${data_item.id}`} data={data_item} >
                                            <DataItemComponent dataItem={data_item} />
                                        </Draggable>
                                    )
                                })
                            }
                            </div> 
                        </>
                    )
                : null
            }
            {
                 (level == "Templates") ?  
                 <>
                    <div className="bg-black flex flex-row justify-between items-center p-2">
                        <p className="text-white">Add Template</p>
                        <button onClick={() => setIsOpenTemplateModal(true)}>Add</button>
                    </div>
                    <div className="flex flex-col gap-4">
                    {
                        templates?.map((template) => {
                            return <TemplateItemComponent template={template} />
                        })
                    }
                    </div> 
                 </>
                : null
            }

            <AddDetailsModal isOpen={isDataItemModalOpen} setIsOpen={setIsOpenDataItemModal}  />
            <AddTemplateModal isOpen={isTemplateModalOpen} setIsOpen={setIsOpenTemplateModal}  />
        </div>
    )
}
