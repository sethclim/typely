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
import { Toggle } from "./Toggle";
import { GrabHandle } from "./GrabHandle";
import { PlusIcon } from "@heroicons/react/20/solid";
import { DeleteModal } from "./DeleteModal";

// type componentLibraryProps = {
//     // latex_comps : Array<Block>
// }

export type DataItemsProps = {
    dataItem : DataItem
}

export const DataItemComponent = (props : DataItemsProps) => {
    const [isEditDataItemModalOpen, setIsOpenEditDataItemModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    
    const onEdit = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setIsOpenEditDataItemModal(true)
    }

    const onDelete = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setShowDeleteModal(true)
    }

    const performDeleteAction = () => {
        ResumeDataItemTable.delete(props.dataItem.id)
        setShowDeleteModal(false)
    }

    return(
        <>
            <Toggle
                buttonStyle = "flex justify-between items-center px-2 py-1 text-sm font-medium text-left text-white bg-darkest rounded-sm group" 
                barContents={
                    <div className="flex flex-1 justify-between pr-4">
                        <h3 className="text-grey text-md text-bold">{props.dataItem.title}</h3>
                        <div className="flex flex-row gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                            <button className="text-grey hover:text-mywhite" onClick={(e) => onEdit(e)}>Edit</button>
                            <button className="text-grey hover:text-mywhite" onClick={(e) => onDelete(e)}>Delete</button>
                        </div>
                    </div>
                }
                postBarContent={
                    <div className="pl-2">
                        <GrabHandle />
                    </div>
                }
                >
            {
                (props.dataItem.data !== null) ? (
                    <table className="min-w-full divide-y divide-white border border-white bg-black">
                        <thead className="">
                            <tr>
                            <th className="px-2 py-2 text-left font-medium text-white">Key</th>
                            <th className="px-2 py-2 text-left font-medium text-white">Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-darker divide-y divide-white border border-white">
                          {props.dataItem.data.map(([key, value]) => (
                            <tr key={key} className="hover:bg-dark">
                                <th className="px-2 py-2 text-left font-medium text-grey">{key}</th>
                                <td className="px-2 py-2 text-left text-grey">{value}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    // <p className="text-white max-h-40 text-ellipsis">{props.dataItem.data}</p>
                ):null
            }
            </Toggle>
            <AddDetailsModal isOpen={isEditDataItemModalOpen} setIsOpen={setIsOpenEditDataItemModal} dataItem={props.dataItem} />
            <DeleteModal 
                msg={`Are you sure you want to delete ${props?.dataItem.title}?`} 
                setIsOpen={setShowDeleteModal} 
                isOpen={showDeleteModal}   
                dangerAction={performDeleteAction}/>
        </>
    )
}


export type TemplateItemComponentProps = {
    template: Template
}

export const TemplateItemComponent = (props : TemplateItemComponentProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const edit = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setIsOpen(true)
    }

    const saveChange = (text : string) => {
        TemplateTable.update(props.template.id, text)
    }

    return (
        <>
            <Toggle 
                buttonStyle = "flex justify-between items-center px-2 py-1 text-sm font-medium text-left text-white bg-darkest rounded-sm group" 
                barContents={
                    <div className="flex flex-1 justify-between pr-4">
                        <h3 className="text-md text-bold text-grey">{props.template.name}</h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                            <button className="text-grey hover:text-mywhite px-2" onClick={(e) => edit(e)}>Edit</button>
                        </div>
                    </div>
                }
                postBarContent={
                    <div className="pl-2">
                        <GrabHandle />
                    </div>
                }
            >
                <SyntaxHighlighter className="z-50 text-left" language="latex" style={atomOneDark} >
                    {props.template.content}
                </SyntaxHighlighter>
            </Toggle>
            <LatexEditor isOpen={isOpen} setIsOpen={setIsOpen} latex={props.template.content} saveChange={saveChange} />
        </>
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
        created_at: row.created_at!,
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

type AddBarProps = {
    title : string
    action : (state : boolean) => void
}
// bg-gradient-to-tr from-dark to-primary/50 my-8 rounded-sm
const AddBar = (props: AddBarProps) => {
    return(
        <div className="bg-darkest flex flex-row justify-between items-center p-2 h-10">
            <p className="text-grey">{props.title}</p>
            <button className="bg-grey/20 opacity-100 hover:bg-primary/80 my-8 p-1 rounded-sm font-bold text-lg transition-bg duration-150" onClick={() => props.action(true)}>
                <PlusIcon className="text-mywhite h-5 w-5" />
            </button>
        </div>
    )
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
        <div className="flex flex-col p-2">
            <h3 className="text-xl text-bold text-grey">Component Library</h3>

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
                                <AddBar title="Add Item" action={setIsOpenDataItemModal} />
                                <div className="flex flex-col gap-1 bg-dark p-2">
                                {
                                    dataItems?.map((data_item) => {
                                        return (
                                            <Draggable key={data_item.id} dragId={`dataitem-${data_item.id}`} data={data_item}  >
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
                        <AddBar title="Add Template" action={setIsOpenTemplateModal} />
                        <div className="flex flex-col gap-1 bg-dark p-2">
                        {
                            templates?.map((template) => {
                                return (
                                    <Draggable<Template> key={template.id} dragId={`template-${template.id}`} data={template} >
                                        <TemplateItemComponent template={template} />
                                    </Draggable>
                                )
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
