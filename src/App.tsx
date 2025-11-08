import { useEffect, useState } from 'react'
import './App.css'

import { openLatexFile, openTextFile, saveJSONFile, saveTextFile } from './services/FileSystem'
import { ResumeTemplateDisplay } from './components/ResumeTemplateDisplay'
import { ComponentLibrary } from './components/ComponentLibrary'

export type Block = {
  name: string
  content : string
}

export type ResumeTemplate = {
  components : Array<Block>
}

export type HeaderInfo = {
  name: string,
}

export type Resume = {
  name : string
  // template : ResumeTemplate,
  // data : string
}


import { DB } from "./db";
import { ResumeConfigTable, ResumeDataItemTable, ResumeDataItemTypeTable, ResumeSectionConfigTable, ResumeSectionDataTable } from "./db/tables";
import { useResume } from './context/resume/ResumeContext'
import { ResumeProvider } from './context/resume/ResumeProvider'

const ResumeView = () => {
  const { resume: myResume } = useResume();
  
  const [files, setFiles] = useState([])
  const [newCompName, setNewCompName] = useState("")
  const [content, setContent] = useState("")
  const [latexComps, setLatexComps] = useState<Array<Block>>([])
  const [resumeTemplate, setResumeTemplate] = useState({
    components : [
      {
        "name" : "header",
        "content" : "latex latex latex"
      },
      {
        "name" : "footer",
        "content" : "latex latex latex"
      }
    ]
  })


  const readFileHandler = async() => {
    const res = await openTextFile()
    if (res != undefined)
      setContent(res)
  }

  // const readLatexHandler = async() => {
  //   const res = await openLatexFile()
  //   if (res != undefined)
  //   {
  //     const temp = [...latexComps]
  //     temp.push(res)
  //     setLatexComps(temp)
  //   }
  // }

  const addLatexComp = async() => {

    const res = await openLatexFile()
    if (res != undefined)
    {

      const newBlock : Block = {
        name : newCompName,
        content : res
      }

      const temp = [...latexComps]
      temp.push(newBlock)
      setLatexComps(temp)
    }

  }

  return (
    <>
      <div className='flex flex-row'>
        {/* <FileListDisplay files={files} /> */}
        <ComponentLibrary latex_comps={latexComps} />
        <div>
          <textarea
            style={{ width: "100%", height: "300px", marginTop: "1rem" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="File content appears here..."
          />
          <input onChange={(e) => setNewCompName(e.target.value)} />
          <button onClick={() => readFileHandler()}>OPEN</button>
          <button onClick={() => addLatexComp()}>OPEN Laxtex</button>
          <button onClick={() => saveTextFile(content)}>SAVE</button>
          <button onClick={() => saveJSONFile(JSON.stringify(resumeTemplate))}>SAVE Template</button>
        </div>
        <div>
          <h3>{myResume?.name}</h3>
          <ResumeTemplateDisplay resumeTemplate={resumeTemplate} />
        </div>
      </div>
    </>
  )
}

function App() {

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
        //   "template_id": 1111,
        //   "section_order": 0,
        //   "section_type": "header"
        // })

        // ResumeSectionDataTable.insert({
        //   section_id: 1,
        //   data_item_id: 1
        // })

        // ResumeDataItemTable.insert({
        //   "id": 1,
        //   title: "header",
        //   description: "resume header",
        //   data: "{'something': 'sometning'}",
        //   type_id: 1,
        //   "created_at" : Date.now().toString(),
        //   "updated_at" : Date.now().toString(),
        // })

        // ResumeDataItemTypeTable.insert({
        //   "id": 1,
        //   name : "header"
        // })
      }
      init();
    }, []
  )

 return (
    <ResumeProvider resumeId={1}>
      <ResumeView />
    </ResumeProvider>
 )
}

export default App
