import { useEffect, useState } from 'react'
import './App.css'

import { openLatexFile, openTextFile, saveFile, saveJSONFile, saveTextFile } from './services/FileSystem'
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
import { ResumeTable } from "./db/tables";
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
          {/* <ResumeTemplateDisplay resumeTemplate={resumeTemplate} /> */}
        </div>
      </div>
    </>
  )
}

function App() {

  useEffect(() => {
      const init = async () => {
        await DB.ready;

        // Create users table if not exists
        DB.runAndSave("CREATE TABLE IF NOT EXISTS resume (id INT, name TEXT)");
        // const res = ResumeTable.getResume()

        // console.log("Saved " + JSON.stringify(res))

        // ResumeTable.updateHeader({name : "Seth CLimenhaga"})

        // const res2 = ResumeTable.getResume()

        // console.log("Saved " + JSON.stringify(res2))

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
