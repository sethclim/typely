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

        DB.runAndSave(`
          CREATE TABLE IF NOT EXISTS resume_config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          )
        `);
        DB.runAndSave(`
          CREATE TABLE IF NOT EXISTS resume_section_config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resume_id INTEGER NOT NULL,
            section_type TEXT NOT NULL,
            template_id INTEGER NOT NULL,
            section_order INTEGER DEFAULT 0,
            FOREIGN KEY (resume_id) REFERENCES resume_config(id) ON DELETE CASCADE,
            FOREIGN KEY (template_id) REFERENCES template(id)
          )
        `);
        DB.runAndSave(`
          CREATE TABLE IF NOT EXISTS template (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            section_type TEXT NOT NULL,
            content TEXT NOT NULL,
            description TEXT,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `);
        DB.runAndSave(`
          CREATE TABLE IF NOT EXISTS resume_section_data (
            section_id INTEGER NOT NULL,
            data_item_id INTEGER NOT NULL,
            PRIMARY KEY (section_id, data_item_id),
            FOREIGN KEY (section_id) REFERENCES resume_section_config(id) ON DELETE CASCADE,
            FOREIGN KEY (data_item_id) REFERENCES data_item(id)
          )
        `);
        DB.runAndSave(`
          CREATE TABLE IF NOT EXISTS data_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type_id INTEGER NOT NULL,
            title TEXT,
            description TEXT,
            data TEXT, -- store JSON as TEXT
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (type_id) REFERENCES data_item_type(id)
          )
        `);
        DB.runAndSave(`
          CREATE TABLE IF NOT EXISTS data_item_type (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          )
        `);

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

        ResumeSectionDataTable.insert({
          section_id: 1,
          data_item_id: 1
        })

        ResumeDataItemTable.insert({
          "id": 1,
          title: "header",
          description: "resume header",
          data: "{'something': 'sometning'}",
          type_id: 1,
          "created_at" : Date.now().toString(),
          "updated_at" : Date.now().toString(),
        })

        ResumeDataItemTypeTable.insert({
          "id": 1,
          name : "header"
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
