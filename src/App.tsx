import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FileListDisplay } from './components/FIleLIst'

function App() {

  const [files, setFiles] = useState([])

  return (
    <>
      <div>
        <FileListDisplay files={files} />
      </div>
    </>
  )
}

export default App
