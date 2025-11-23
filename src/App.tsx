import { useEffect, useState } from 'react'
import './App.css'

import { openTextFile, saveTextFile } from './services/FileSystem'
import { ResumeTemplateDisplay } from './components/ResumeTemplateDisplay'

import { DB } from "./db";
import { useResume } from './context/resume/ResumeContext'
import { ResumeProvider } from './context/resume/ResumeProvider'
import { ResumeConfigTable, ResumeSectionConfigTable, ResumeSectionDataTable, ResumeDataItemTable, ResumeDataItemTypeTable, TemplateTable } from './db/tables';

import Modal from "./components/Modal";
import ComboBox from './components/ComboBox';
import { ComponentLibrary } from './components/ComponentLibrary';

import {DndContext, DragEndEvent} from '@dnd-kit/core';

const ResumeView = () => {
  const { resume: myResume } = useResume();
  
  const [newCompName, setNewCompName] = useState("")
  const [content, setContent] = useState("")

  const [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);

  const readFileHandler = async() => {
    const res = await openTextFile()
    if (res != undefined)
      setContent(res)
  }

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

function App() {

  function handleDragEnd(event : DragEndEvent) {
    console.log("DRAG ENDED!!! " +  event.over?.id)
    if (event.over && event.over.id.toString().startsWith("dataitem-")) {

      const [, section_id] = event.over.id.toString().split('-');

      console.log("DRAG dataitem event id" +  section_id + " active id " + event.active.id.toString())


      ResumeSectionDataTable.insert({
        section_id: parseInt(section_id),
        data_item_id: parseInt(event.active.id.toString())
      })
    }
  }

  useEffect(() => {
      const init = async () => {
        await DB.ready;

        // ResumeConfigTable.insert({
        //   "id": 1,
        //   "name" : "Resume_1",
        //   "created_at" : Date.now().toString(),
        //   "updated_at" : Date.now().toString(),
        // })

        // ResumeSectionConfigTable.insert({
        //   "id": 1,
        //   "resume_id": 1,
        //   "template_id": 1,
        //   "section_order": 0,
        //   "section_type": "header"
        // })

        // ResumeSectionConfigTable.insert({
        //   "id": 2,
        //   "resume_id": 1,
        //   "template_id": 2,
        //   "section_order": 1,
        //   "section_type": "skills"
        // })

        // ResumeSectionDataTable.insert({
        //   section_id: 1,
        //   data_item_id: 1
        // })

        // ResumeSectionDataTable.insert({
        //   section_id: 2,
        //   data_item_id: 2
        // })

        // ResumeDataItemTable.insert({
        //   "id": 1,
        //   title: "email",
        //   description: "my email",
        //   data: '{"email": "sethclim@gmail.com"}',
        //   type_id: 1,
        //   "created_at" : Date.now().toString(),
        //   "updated_at" : Date.now().toString(),
        // })

        // ResumeDataItemTypeTable.insert({
        //   "id": 1,
        //   name : "email"
        // })

        // ResumeDataItemTypeTable.insert({
        //   "id": 2,
        //   name : "skill"
        // })

        // const headerLaTeX = `\\newcommand{\\AND}{\\unskip
        //   \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        //   \\ignorespaces
        //   }
        //   \\newsavebox\\ANDbox
        //   \\sbox\\ANDbox{$|$}

        //   \\begin{header}
        //       \\fontsize{31 pt}{31 pt}\\selectfont Seth Climenhaga
        //   \\end{header}
        //   `;


        // TemplateTable.insert({
        //   "id": 1,
        //   "name": "header template",
        //   "description": "this is a header template",
        //   "section_type": "header",
        //   "created_at" : Date.now().toString(),
        //   "content": headerLaTeX
        // })

        // const skillsLatex = `\\textbf{Languages:} C++, GO, Rust, C\\#, Python, Typescript, Lua, HLSL/GLSL \\newline
        //                       \\textbf{AR/VR:} Unity, Vive, HoloLens, Quest, Unity XR Interation Tool Kit  \\newline
        //                       \\textbf{Frameworks:} Vulkan, OpenGL, JUCE, Skia, Dear ImGui, GLFW, GLM, Kubernetes, WebRTC  \\newline
        //                       \\textbf{General:} OOP, Functional, Git, Docker, CI/CD (Terraform, GitHub Actions), SQL, AWS \\newline`

        // TemplateTable.insert({
        //   "id": 2,
        //   "name": "skills template",
        //   "description": "this is a s template",
        //   "section_type": "header",
        //   "created_at" : Date.now().toString(),
        //   "content": skillsLatex
        // })
      }
      init();
    }, []
  )

 return (
    <ResumeProvider resumeId={1}>
      <DndContext onDragEnd={handleDragEnd}>
        <ResumeView />
      </DndContext>
    </ResumeProvider>
 )
}

export default App
