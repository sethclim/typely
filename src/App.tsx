import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import { FileListDisplay } from './components/FIleLIst'
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

type ResumeInstance = {
  template : ResumeTemplate,
  data : string
}

import { DB } from "./db";
import { ResumeTable } from "./db/tables";

function App() {

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

   useEffect(() => {
      const init = async () => {
        await DB.ready;

        // Create users table if not exists
        DB.runAndSave("CREATE TABLE IF NOT EXISTS resume (id INT, name TEXT)");
        ResumeTable.insert({ id: 1, name: "Alice" });
        const res = ResumeTable.findAll()

        console.log("Saved " + JSON.stringify(res))

      }
      init();
    }, []
  )

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
          <ResumeTemplateDisplay resumeTemplate={resumeTemplate} />
        </div>
      </div>
    </>
  )
}

export default App
