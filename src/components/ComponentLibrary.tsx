import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ResumeDataItemTable, TemplateTable,  } from '../db/tables';
import { DataItemRow, TemplateRow } from "../db/types";
import { DB } from "../db";
import { DataItem, DataItemType, Template } from "../types";
import ThreeWaySlider from "./ThreeWaySlider";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Modal from "./Modal";

type componentLibraryProps = {
    // latex_comps : Array<Block>
}

export function mapRowToDataItem(
    row: DataItemRow,
    // type: DataItemType
): DataItem {
   const d : DataItemType = {id: 14, name: "TODO"}
    return {
        id: row.id,
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

interface AddDetailsModalProps {
  isOpen: boolean;
  setIsOpen : Dispatch<SetStateAction<boolean>>
}

const AddDetailsModal = (props : AddDetailsModalProps) => {
    const [items, setItems] = useState<Record<string, string>>({});
    const [title, setTitle] = useState<string>()
    const [key, setKey]     = useState<string>()
    const [value, setValue] = useState<string>()

    const addItem = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (key == undefined || value == undefined || key == "" || value == "")
            return;

        setItems(prev => ({
            ...prev,
            [key]: value,
        }));

        setKey("")
        setValue("")
    }

    const AddDataItem = () => {
        if (Object.keys(items).length === 0 || title == "" || title == null)
            return;

        ResumeDataItemTable.insert({
            "id": 1,
            title: title,
            description: "some disc",
            data: JSON.stringify(items),
            type_id: 55,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })

        // setSelected(null);
        props.setIsOpen(false);
    }

    return (
        <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
            <h2 className="text-xl font-bold mb-4 text-black">Add DataItem</h2>
            <form>
                <p className="text-black">Title</p>
                <input className="text-black" value={title} onChange={(e) => setTitle(e.target.value)} />
                <p className="text-black">Items</p>
                <div className="flex flex-col border-solid border-black">
                    {
                        Object.entries(items).map(([key, value]) => (
                                <div className="flex flex-row">
                                    <p className="text-black pr-2">Key</p>
                                    <p className="text-black">{key}</p>
                                    <p className="text-black px-2">Value</p>
                                    <p className="text-black">{value}</p>
                                </div>
                            )
                        )
                    }
                    <div className="flex flex-row">
                        <p className="text-black pr-2">Key</p>
                        <input className="text-black" value={key} onChange={(e) => setKey(e.target.value)} />
                        <p className="text-black px-2">Value</p>
                        <input className="text-black" value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="text-sm bg-green-500 px-4" onClick={(e) => addItem(e)}>Add</button>
                </div>
            </form>
            <div className='flex flex-row gap-4'>
            <button
                className="mt-4 px-4 py-2 bg-black text-white rounded"
                onClick={() => AddDataItem()}
            >
                Add
            </button>
            <button
                className="mt-4 px-4 py-2 bg-black text-white rounded"
                onClick={() => props.setIsOpen(false)}
            >
                Cancel
            </button>
            </div>
        </Modal>
    )
}

export const ComponentLibrary = (props : componentLibraryProps) => {

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
                        dataItems?.map((comp) => {
                            return (
                                <div className="max-h-20 text-black text-ellipsis overflow-hidden bg-black/20 m-2">
                                    <h3 className="text-xl text-bold">{comp.title}</h3>
                                    <p className="max-h-40 text-ellipsis">{comp.data}</p>
                                </div>
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
                            return (
                                <div className=" text-black text-ellipsis overflow-hidden bg-white/40">
                                    {/* <p>{JSON.stringify(template)}</p> */}
                                    <h3 className="text-xl text-bold">{template.name}</h3>
                                    <SyntaxHighlighter language="latex" style={nord} >
                                        {template.content}
                                    </SyntaxHighlighter>
                                    {/* <p className="max-h-40 text-ellipsis">{template.content}</p> */}
                                </div>
                            )
                        })
                    }
                    </div> 
                : null
            }

            <AddDetailsModal isOpen={isOpen} setIsOpen={setIsOpen}  />
        </div>
    )
}