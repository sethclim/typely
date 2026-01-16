import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ResumeDataItemTable,  } from '../db/tables';

import Modal from "./Modal";
import { DataItem, Template } from "../types";
import { Dropdown } from "./Dropdown";
import { useResume } from "../context/resume/ResumeContext";
import { useThemes } from "../context/themes/ThemesContext";
import { Checkbox } from '@headlessui/react'

interface AddDetailsModalProps {
  isOpen: boolean;
  setIsOpen : Dispatch<SetStateAction<boolean>>
  dataItem? : DataItem 
}

export const AddDetailsModal = (props : AddDetailsModalProps) => {
    const [items, setItems] = useState<[string,string][]>(props.dataItem ? props.dataItem.data : [["", ""]]);
    const [title, setTitle] = useState<string>(props.dataItem?.title ?? "")
    
    const [stage, setStage] = useState(0)
    
    const { resume: myResume } = useResume();
    const { themes } = useThemes()
    
    const [inUseTemplates, setInUseTemplates] = useState<Template[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<Template>()

    useEffect(() => {
        console.log("myResume?.theme.templates " + myResume?.theme.id)
        const themeId = myResume?.theme.id
        if(themeId)
        {
            const theme = themes.filter(t => t.id === themeId)[0]
            console.log("@theme templates" + JSON.stringify(theme.templates))
            setInUseTemplates(theme.templates)
        }
    },[myResume])

    const updateItem = (index : number, newtext : string, type : number) => {
        const items_clone = [...items] 
        items_clone[index][type] = newtext

        setItems(items_clone);
    }

    const addItem = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        setItems(prev => ([
            ...prev,
            ["", ""]
        ]));
    }

    const AddDataItem = () => {
        if (Object.keys(items).length === 0 || title == "" || title == null)
            return;

        if(!props.dataItem){
            ResumeDataItemTable.insert({
                title: title,
                description: "some disc",
                data: JSON.stringify(items),
                type_id: 55,
                "created_at" : Date.now().toString(),
                "updated_at" : Date.now().toString(),
            })
        }else{
            ResumeDataItemTable.update({
                id : props.dataItem.id,
                title: title,
                description: "some disc",
                data: JSON.stringify(items),
                type_id: 55,
                "updated_at" : Date.now().toString(),
            })
        }
        clearState()
        props.setIsOpen(false);
    }

    const [sTemplateKeys, setSTemplateKeys] = useState<string[]>([])

    const selectedTemplateToAddFor = (name : string) => {
        const templateS = inUseTemplates.filter(t => t.name === name)[0]
        setSelectedTemplate(templateS)

        const regex = /\[\[([^\]]+)\]\]/g;

        const matches = [...templateS.content.matchAll(regex)].map(m => m[1]);

        console.log(matches);

        const uniqueMatches = [...new Set(matches)];

        setSTemplateKeys(uniqueMatches)
        setSelectedKeys([])
    }

    const [selectedKeys, setSelectedKeys] = useState<string []>([])

    const addKeyToSelectedKeys = (k : string) => {
        if(selectedKeys.includes(k))
        {
            const idx = selectedKeys.indexOf(k)
            const copy = [...selectedKeys]
            copy.splice(idx, 1)
            setSelectedKeys(copy)
        }
        else
            setSelectedKeys(ks => [...ks, k])
    }

    const onNextStage = () => {
       const startItems: [string, string][] = selectedKeys.map(n => [n, ""]);
       setItems(startItems);
       setStage(1)
    }


    const clearState = () => {
        setStage(0)
        setSTemplateKeys([])
        setSelectedKeys([])
    }

    const onCancel = () => {
        clearState()
        props.setIsOpen(false)
    }

    return (
        <Modal isOpen={props.isOpen} onClose={() => onCancel()} width="w-300">
            <h2 className="text-xl font-bold mb-4 text-mywhite">Add DataItem</h2>
            {
                stage == 0 && inUseTemplates.length > 0 ? (
                    <div className="text-mywhite min-h-80">
                        <h3 className="text-mywhite">Select Template to Create Dataitem For</h3>
                        <Dropdown 
                            options={inUseTemplates.map(t => t.name) ?? []} 
                            selected={selectedTemplate?.name ?? "SELECT"} 
                            onSelected={(t) => selectedTemplateToAddFor(t)} />
                        <div className="flex flex-col mt-4">
                            <h4>Select Keys For DataItem</h4>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {
                                    sTemplateKeys.map(m =>  (
                                            <div className="flex flex-row items-center gap-2 p-1 m-1">
                                                <Checkbox
                                                    checked={selectedKeys.includes(m)}
                                                    onChange={() => addKeyToSelectedKeys(m)}
                                                    className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
                                                    >
                                                    {/* Checkmark icon */}
                                                    <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                                                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Checkbox>

                                                <p>{m}</p>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="text-mywhite bg-primary px-2 py-1 rounded-sm" onClick={onNextStage}>NEXT</button>
                        </div>
                    </div>
                ) : null
            }
            {
                stage == 1 ? (
                    <>
                        <form>
                            <p className="text-mywhite">Title</p>
                            <input className="text-black bg-gray-200 p-1" value={title} onChange={(e) => setTitle(e.target.value)} />
                            <p className="text-black">Items</p>
                            <div className="flex flex-col border-solid border-black">
                                <table className="min-w-full divide-y divide-white border border-grey bg-black">
                                    <thead className="">
                                        <tr>
                                            <th className="px-2 py-2 text-left font-medium text-white w-50">Key</th>
                                            <th className="px-2 py-2 text-left font-medium text-white">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-white border border-grey">
                                    {
                                        items.map(([key, value], index) => (
                                                <tr key={index}>
                                                    {/* <p className="text-black pr-2">Key</p> */}
                                                    <td>
                                                        <input className="text-mywhite bg-dark p-1 w-full" value={key} onChange={(e) => updateItem(index, e.target.value, 0)} />
                                                    </td>
                                                    {/* <p className="text-black px-2">Value</p> */}
                                                    <td>
                                                        <input className="text-mywhite bg-dark p-1 mr-2 w-full" value={value} onChange={(e) => updateItem(index, e.target.value, 1)} />
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    }
                                    </tbody>
                                </table>
                                <div className="flex justify-end p-2 pt-4">
                                    <button className="bg-primary px-4 text-white rounded-sm" onClick={(e) => addItem(e)}>Add</button>
                                </div>
                            </div>
                
                        </form>
                        <div className='flex flex-row gap-4'>
                            <button
                                className="mt-4 px-4 py-2 bg-grey hover:bg-mywhite text-darkest rounded"
                                onClick={() => AddDataItem()}
                            >
                                {props.dataItem ? "Update" : "Add"}
                            </button>
                            <button
                                className="mt-4 px-4 py-2 bg-grey hover:bg-mywhite text-darkest rounded"
                                onClick={() => onCancel()}
                            >
                                Cancel
                            </button>
                        </div>
                    </>

                ) : null
            }
        </Modal>
    )
}