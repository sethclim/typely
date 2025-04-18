import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FileListDisplay } from './components/FIleLIst'
import { openFile, saveFile } from './services/FileSystem'

function App() {

  const [files, setFiles] = useState([])

  const [content, setContent] = useState("")

  const readFileHandler = async() => {
    const res = await openFile()
    if (res != undefined)
      setContent(res)
  }

  return (
    <>
      <div>
        <FileListDisplay files={files} />
        <p>{content}</p>
        <button onClick={() => readFileHandler()}>OPEN</button>
        <button onClick={() => saveFile("This is a message")}>SAVE</button>
      </div>
    </>
  )
}

export default App
