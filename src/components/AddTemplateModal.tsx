import { Dispatch, SetStateAction, useState } from "react"

import Modal from "./Modal";
import { useDataContext } from "../context/data/DataContext";

interface AddTemplateModalProps {
  isOpen: boolean;
  setIsOpen : Dispatch<SetStateAction<boolean>>
}

export const AddTemplateModal = (props : AddTemplateModalProps) => {
    const [title, setTitle] = useState<string>()

    const { repositories } = useDataContext();

    const AddTemplate = () => {
        if (title == "" || title == null)
            return;

        repositories.template.insert({
            "name": title,
            "description": "this is a header template",
            "section_type": "header",
            "created_at" : Date.now().toString(),
            "content": "//begin template"
        })

        // setSelected(null);
        props.setIsOpen(false);
    }

    return (
        <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)} width="w-100">
            <h2 className="text-xl font-bold mb-4 text-mywhite">Add Template</h2>
            <form>
                <p className="text-grey">Title</p>
                <input className="bg-grey text-black p-1 my-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </form>
            <div className='flex flex-row gap-4'>
            <button
                className="mt-4 px-4 py-2 bg-grey hover:bg-mywhite text-darkest rounded"
                onClick={() => AddTemplate()}
            >
                Add
            </button>
            <button
                className="mt-4 px-4 py-2 bg-grey hover:bg-mywhite text-darkest rounded"
                onClick={() => props.setIsOpen(false)}
            >
                Cancel
            </button>
            </div>
        </Modal>
    )
}