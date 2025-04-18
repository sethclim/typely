import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import { FileListDisplay } from './components/FIleLIst'
import { openTextFile, saveFile, saveJSONFile, saveTextFile } from './services/FileSystem'
import { ResumeTemplateDisplay } from './components/ResumeTemplateDisplay'

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

function App() {

  const [files, setFiles] = useState([])

  const [content, setContent] = useState("")

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

  return (
    <>
      <div className='flex flex-row'>
        {/* <FileListDisplay files={files} /> */}
        <div>
          <textarea
            style={{ width: "100%", height: "300px", marginTop: "1rem" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="File content appears here..."
          />
          <button onClick={() => readFileHandler()}>OPEN</button>
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
