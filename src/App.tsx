import { useEffect, useState } from 'react'
import './App.css'

import { openTextFile, saveTextFile } from './services/FileSystem'
import { ResumeTemplateDisplay } from './components/ResumeTemplateDisplay'
// import { ComponentLibrary } from './components/ComponentLibrary'



import { DB } from "./db";
import { useResume } from './context/resume/ResumeContext'
import { ResumeProvider } from './context/resume/ResumeProvider'
import { ResumeConfigTable, ResumeSectionConfigTable, ResumeSectionDataTable, ResumeDataItemTable, ResumeDataItemTypeTable, TemplateTable } from './db/tables';

const ResumeView = () => {
  const { resume: myResume } = useResume();
  
  const [newCompName, setNewCompName] = useState("")
  const [content, setContent] = useState("")



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

  // const addLatexComp = async() => {

  //   const res = await openLatexFile()
  //   if (res != undefined)
  //   {

  //     const newBlock : Block = {
  //       name : newCompName,
  //       content : res
  //     }

  //     const temp = [...latexComps]
  //     temp.push(newBlock)
  //     setLatexComps(temp)
  //   }

  // }

  return (
    <>
      <div className='flex flex-row'>
        {/* <FileListDisplay files={files} /> */}
        {/* <ComponentLibrary latex_comps={latexComps} /> */}
        <div>
          <textarea
            style={{ width: "100%", height: "300px", marginTop: "1rem" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="File content appears here..."
          />
          <input onChange={(e) => setNewCompName(e.target.value)} />
          <button onClick={() => readFileHandler()}>OPEN</button>
          {/* <button onClick={() => addLatexComp()}>OPEN Laxtex</button> */}
          <button onClick={() => saveTextFile(content)}>SAVE</button>
          {/* <button onClick={() => saveJSONFile(JSON.stringify(resumeTemplate))}>SAVE Template</button> */}
        </div>
        <div>
          <h3>{myResume?.name}</h3>
          {
            myResume?.sections.map((section) => {
              return <ResumeTemplateDisplay resumeSection={section} /> 
            })
          }
        </div>
      </div>
    </>
  )
}

function App() {

  useEffect(() => {
      const init = async () => {
        await DB.ready;

        ResumeConfigTable.insert({
          "id": 1,
          "name" : "Resume_1",
          "created_at" : Date.now().toString(),
          "updated_at" : Date.now().toString(),
        })

        ResumeSectionConfigTable.insert({
          "id": 1,
          "resume_id": 1,
          "template_id": 1111,
          "section_order": 0,
          "section_type": "header"
        })

        ResumeSectionConfigTable.insert({
          "id": 2,
          "resume_id": 1,
          "template_id": 1,
          "section_order": 0,
          "section_type": "header"
        })

        ResumeSectionDataTable.insert({
          section_id: 1,
          data_item_id: 1
        })

        ResumeSectionDataTable.insert({
          section_id: 2,
          data_item_id: 1
        })

        ResumeDataItemTable.insert({
          "id": 1,
          title: "header",
          description: "resume header",
          data: "{'email': 'sethclim@gmail.com'}",
          type_id: 1,
          "created_at" : Date.now().toString(),
          "updated_at" : Date.now().toString(),
        })

        ResumeDataItemTypeTable.insert({
          "id": 1,
          name : "header"
        })

        const headerLaTeX = `\\newcommand{\\AND}{\\unskip
          \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
          \\ignorespaces
          }
          \\newsavebox\\ANDbox
          \\sbox\\ANDbox{$|$}

          \\begin{header}
              \\fontsize{31 pt}{31 pt}\\selectfont Seth Climenhaga
          \\end{header}
          `;


        TemplateTable.insert({
          "id": 1,
          "name": "header template",
          "description": "this is a header template",
          "section_type": "header",
          "created_at" : Date.now().toString(),
          "content": headerLaTeX
        })
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
