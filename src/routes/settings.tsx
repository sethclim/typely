import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { DB } from '../db'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {

    const backUpSQLite = () => {
        const data = DB.db.export();
        const blob = new Blob([data], { type: "application/octet-stream" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "my_database.sqlite";
        a.click();
    }

    return (
        <>
            <Header />
                <div className='grow flex flex-row justify-center'>
                    <div className="min-w-150 p-4 pt-10 text-mywhite" >
                        <h1 className='text-mywhite text-xl'>SETTINGS</h1>
                        <div className='flex justify-start items-start flex-col gap-4 bg-dark min-w-150 p-4 rounded'>
                            <h3 className='text-lg'>DATA</h3>
                            <p className='text-grey'>Download data from browser</p>
                            <button className='bg-mywhite text-black p-2 rounded' onClick={backUpSQLite}>BACKUP DATA</button>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
  )
}
