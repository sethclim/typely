import { ResumeSection } from "../types"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type ResumeTemplateDisplayProps = {
    resumeSection : ResumeSection
}

export const ResumeTemplateDisplay = (props : ResumeTemplateDisplayProps) => {

    return(
        <div className="flex flex-col items-start gap-4 bg-black p-4">
            <h3 className="text-white text-lg">SectionType: {props.resumeSection.sectionType}</h3>
            <p className="text-white text-md">template:</p>
            <pre className="w-full bg-black">
                <SyntaxHighlighter language="latex" style={nord} >
                    {props.resumeSection.template?.content}
                </SyntaxHighlighter>
            </pre>
            {/* <p  className="text-black text-sm">{props.resumeSection.template?.content}</p> */}
            <p className="text-white text-md">Data Items:</p>
            {
                props.resumeSection.items.map((component, index) => {
                    return (
                        <div key={index} className="flex flex-col items-start  w-200 flex ">
                            {/* <h1 className="text-black text-sm">{component.title}</h1> */}
                            <p  className="text-white">{component.data}</p>
                            {/* <p  className="text-black">{component.data}</p> */}
                        </div>
                    ) 
                })
            }
        </div>
    )
}