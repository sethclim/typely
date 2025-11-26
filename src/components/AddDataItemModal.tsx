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

    const addItem = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (key == undefined || value == undefined || key == "" || value == "")
            return;

        setItems(prev => ([
            ...prev,
            [key, value]
        ]));

        setKey("")
        setValue("")
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
        <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)} width="w-100">
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