import { Editor } from '@monaco-editor/react';
import Modal from './Modal';
import { Dispatch, SetStateAction, useState } from 'react';

type LatexEditorProps = {
  isOpen: boolean;
  setIsOpen : Dispatch<SetStateAction<boolean>>
  latex: string
  saveChange: (text : string) => void
}

export const LatexEditor = (props : LatexEditorProps) => {

    const [text, setText] = useState<string | null>(null)

    function handleEditorChange(value : any, event : any) {
        // here is the current value
        console.log("value " + value)
        setText(value)
    }

    const save = () => {
        console.log(text)
        if (text == null)
        {
            props.setIsOpen(false);
            return
        }

        console.log("save")
        props.saveChange(text);
        props.setIsOpen(false);
    }

    return(
        <Modal isOpen={props.isOpen} onClose={() => {}} width=''>
            <div className='w-300'>
                <div className='flex flex-row gap-4'>
                    <button className='bg-black text-white px-2' onClick={() => save()}>SAVE</button>
                    <button className='bg-black text-white px-2' onClick={() => props.setIsOpen(false)}>CLOSE</button>
                </div>
                <div className=' p-4'>
                    <Editor 
                        height="50vh" 
                        defaultLanguage="latex" 
                        value={props.latex} 
                        defaultValue="// some comment"  
                        theme="vs-dark" 
                        onChange={handleEditorChange}
                    />
                </div>
            </div>
        </Modal>
    )
}