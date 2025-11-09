import { ResumeSection } from "../types"

type ResumeTemplateDisplayProps = {
    resumeSection : ResumeSection
}

export const ResumeTemplateDisplay = (props : ResumeTemplateDisplayProps) => {

    return(
        <div className="flex flex-col gap-4">
            {
                props.resumeSection.items.map((component, index) => {
                    return (
                        <div key={index} className="flex flex-col items-start bg-white w-200 flex ">
                            <h1 className="text-black text-sm">{component.title}</h1>
                            <p  className="text-black">{component.data}</p>
                        </div>
                    ) 
                })
            }
        </div>
    )
}