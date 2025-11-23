

import { useState } from 'react'

import { useResume } from '../context/resume/ResumeContext'
import { ResumeSectionConfigTable } from '../db/tables';

import Modal from "./Modal";
import ComboBox from './ComboBox';

import { ResumeTemplateDisplay } from './ResumeTemplateDisplay'
import { ComponentLibrary } from './ComponentLibrary';

export const ResumeView = () => {
  const { resume: myResume } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const createResumeComponent = () => {
    if (myResume === null || selected == null)
      return;

    ResumeSectionConfigTable.insert({
      "id": 3,
      "resume_id": myResume!.id,
      "template_id": -1,
      "section_order": 0, //TODO needs to be the last one in the list
      "section_type": selected!
    })

    setSelected(null);
    setIsOpen(false);
  }

  return (
    <>
      <div className='flex flex-row w-lvw justify-start bg-white'>
        {/* <FileListDisplay files={files} /> */}
        <ComponentLibrary />
        <div className='bg-black'>
          <h3 className='text-4xl font-extrabold text-white'>{myResume?.name}</h3>
          <div className='flex flex-col gap-4 w-150 p-4'>
          {
            myResume?.sections.map((section) => {
              return <ResumeTemplateDisplay key={section.id} resumeSection={section} /> 
            })
          }
          <button onClick={() => setIsOpen(true)}>Add New Component</button>
          </div>
        </div>
         <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">New Resume Block</h2>uik
          <form>
            <p className="text-black">Type</p>
            <ComboBox selected={selected} onSelectedChange={setSelected} options={["Skills"]} />
          </form>
          <div className='flex flex-row gap-4'>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => createResumeComponent()}
            >
              Create
            </button>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}