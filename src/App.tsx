import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FileListDisplay } from './components/FIleLIst'
import { saveFile } from './services/FileSystem'

function App() {

  const [files, setFiles] = useState([])

  return (
    <>
      <div>
        <FileListDisplay files={files} />
        <button onClick={() => saveFile("This is a message")}>SAVE</button>
      </div>
    </>
  )
}

export default App
