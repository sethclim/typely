import { ResumeSection } from "../types"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type ResumeTemplateDisplayProps = {
    resumeSection : ResumeSection
}

export const ResumeTemplateDisplay = (props : ResumeTemplateDisplayProps) => {

    return(
        <div className="flex flex-col items-start  gap-4 bg-white">
            <h3 className="text-black text-lg">{props.resumeSection.sectionType}</h3>
            <p className="text-black text-md">template:</p>
            <SyntaxHighlighter language="latex" style={docco}>
                {props.resumeSection.template?.content}
            </SyntaxHighlighter>
            {/* <p  className="text-black text-sm">{props.resumeSection.template?.content}</p> */}
            <p className="text-black text-md">Data Items:</p>
            {
                props.resumeSection.items.map((component, index) => {
                    return (
                        <div key={index} className="flex flex-col items-start  w-200 flex ">
                            {/* <h1 className="text-black text-sm">{component.title}</h1> */}
                            <p  className="text-black">{component.data}</p>
                            {/* <p  className="text-black">{component.data}</p> */}
                        </div>
                    ) 
                })
            }
        </div>
    )
}