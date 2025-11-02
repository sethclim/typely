import { ResumeTemplate } from "../App"

type ResumeTemplateDisplayProps = {
    resumeTemplate : ResumeTemplate
}

export const ResumeTemplateDisplay = (props : ResumeTemplateDisplayProps) => {

    return(
        <div className="flex flex-col gap-4">
            {
                props.resumeTemplate.components.map((component, index) => {
                    return (
                        <div key={index} className="flex flex-col items-start bg-white w-200 flex ">
                            <h1 className="text-black text-sm">{component.name}</h1>
                            <p  className="text-black">{component.content}</p>
                        </div>
                    ) 
                })
            }
        </div>
    )
}