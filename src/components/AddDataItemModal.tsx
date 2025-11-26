import { Dispatch, SetStateAction, useState } from "react"
import { ResumeDataItemTable,  } from '../db/tables';

import Modal from "./Modal";

interface AddDetailsModalProps {
  isOpen: boolean;
  setIsOpen : Dispatch<SetStateAction<boolean>>
}

export const AddDetailsModal = (props : AddDetailsModalProps) => {
    const [items, setItems] = useState<[string,string][]>([]);
    const [title, setTitle] = useState<string>()
    const [key,   setKey]   = useState<string>()
    const [value, setValue] = useState<string>()

    const updateItem = (index : number, newtext : string, type : number) => {
        const items_clone = [...items] 
        items_clone[index][type] = newtext

        setItems(items_clone);
    }

    const addItem = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        // if (key == undefined || value == undefined || key == "" || value == "")
        //     return;

        // console.log("KEY " + key + " Value " + value)

        setItems(prev => ([
            ...prev,
            ["", ""]
        ]));

        // setKey("")
        // setValue("")
    }

    const AddDataItem = () => {
        if (Object.keys(items).length === 0 || title == "" || title == null)
            return;

        ResumeDataItemTable.insert({
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
        <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)} width="w-300">
            <h2 className="text-xl font-bold mb-4 text-black">Add DataItem</h2>
            <form>
                <p className="text-black">Title</p>
                <input className="text-black bg-gray-200 p-1" value={title} onChange={(e) => setTitle(e.target.value)} />
                <p className="text-black">Items</p>
                <div className="flex flex-col border-solid border-black">
                    <div className="flex flex-col min-h-10 gap-2">
                    {
                        items.map(([key, value], index) => (
                                <div className="flex flex-row">
                                    <p className="text-black pr-2">Key</p>
                                    <input className="text-black bg-gray-200 p-1" value={key} onChange={(e) => updateItem(index, e.target.value, 0)} />
                                    <p className="text-black px-2">Value</p>
                                    <input className="text-black bg-gray-200 p-1 mr-2 w-full" value={value} onChange={(e) => updateItem(index, e.target.value, 1)} />
                                </div>
                            )
                        )
                    }
                    </div>
                    <div className="flex  justify-end p-2 pt-4">
                        <button className="text-sm bg-green-500 px-4" onClick={(e) => addItem(e)}>Add</button>
                    </div>
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