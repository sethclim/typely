import { createFileRoute } from '@tanstack/react-router'
import ResumeStylePicker from '../components/ResumeStylePicker'
import { useState } from 'react'
import { ResumeIntakeForm } from '../components/ResumeIntakeForm'

export const Route = createFileRoute('/onBoarding')({
  component: RouteComponent,
})

function RouteComponent() {
    const [selected, setSelected] = useState(false)
    const [stage, setStage] = useState(0)
    const onSelect = () => {
        setSelected(true)
    }
    return (
        <div className='flex flex-col justify-center  items-center grow'>
            <div className='w-full'>
                {
                    stage == 0 ? (
                        <>
                            <ResumeStylePicker onSelect={onSelect} /> 
                            <div className='w-full h-full flex flex-row justify-end'>
                            {
                                selected ? <button className='bg-green-500 p-2 text-white rounded-sm' onClick={() => setStage(1)}>Next</button> : null
                            }
                            </div>
                        </>
                    ) : null
                }
                {
                    stage == 1 ? <ResumeIntakeForm  /> : null
                }
                
            </div>
        </div>
    )
}
