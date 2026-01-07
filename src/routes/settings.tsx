import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { DB } from '../db'
import { useEffect, useState } from 'react'
import { databaseExists, loadFile } from '../services/OPFS'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {

    const [file, setFile] = useState<Uint8Array | null>(null)
    const [oPFSSaveExists, setOPFSSaveExists] = useState(false)

    useEffect(()=>{
        const init = async() => {
           const res = await databaseExists()
           setOPFSSaveExists(res)
        }
        init()
    },[])

    const backUpSQLite = () => {
        const data = DB.db.export();
        const blob = new Blob([data], { type: "application/octet-stream" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "my_database.sqlite";
        a.click();
    }

    const onRestore = async() => {
        if(!file) return
        DB.restoreDB(file)
    }

    const handleFileChange = async (e : any) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file) console.log("Selected file:", file.name);
        const arrayBuffer = await file.arrayBuffer()
        const uint8 = new Uint8Array(arrayBuffer);
        setFile(uint8)
    };

    const onRestoreFromOPFS  = async() => {
        const file = await loadFile()
        if (!file) return;
        const arrayBuffer = await file.arrayBuffer()
        const uint8 = new Uint8Array(arrayBuffer);
        DB.restoreDB(uint8)
    }

    return (
        <>
            <Header />
                <div className='grow flex flex-row justify-center'>
                    <div className="min-w-150 p-4 pt-10 text-mywhite" >
                        <h1 className='text-mywhite text-xl'>SETTINGS</h1>
                        <div className='flex justify-start items-start flex-col gap-4 bg-dark min-w-150 p-4 rounded'>
                            <h3 className='text-lg'>DATA</h3>
                            {
                                oPFSSaveExists ? (
                                    <>
                                     <p className='text-grey'>Autosave Backup</p>
                                     <button className='bg-mywhite text-black p-2 rounded' onClick={onRestoreFromOPFS}>RESTORE</button>
                                    </>
                                ) : null
                            }
                            <p>{}</p>
                            <p className='text-grey'>Download data from browser</p>
                            <button className='bg-mywhite text-black p-2 rounded' onClick={backUpSQLite}>BACKUP DATA</button>
                            <p className='text-grey'>Restore From Save</p>
                            <input className='bg-darker hover:cursor-pointer' type="file" id="filePicker" accept=".sqlite"  onChange={handleFileChange} />
                            <button className='bg-mywhite text-black p-2 rounded' onClick={onRestore}>RESTORE</button>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
  )
}
