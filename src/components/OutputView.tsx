import { useEffect, useState } from "react";
import ThreeWaySlider from "./ThreeWaySlider"
import { PDFView, ReplaceVariables } from "./PDFView";
import { ResumeConfig } from "../types";

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';



export type OutputViewProps = {
    resume? : ResumeConfig | null
}


export const OutputView = (props : OutputViewProps) => {

    const [level, setLevel] = useState("PDF");
    const [latex, setLatex] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);


    const performTemplating = () => {

        let latex_string = `\\documentclass[10pt, letterpaper]{article}\\usepackage{config}\\begin{document}`
        
        if(props.resume?.sections[1])
            ReplaceVariables(props.resume?.sections[1])

        props.resume?.sections.map((section) => {
            latex_string += ReplaceVariables(section)
        })
        latex_string += `\\end{document}`


        setLatex(latex_string)
        return latex_string
    
    };

    const compileLatex = async (latex : string) => {  
        const latexData = { latex: latex };
        // const api_url = `https://api.typely-vps.uk/compile`
        const api_url = `http://localhost:8080/compile`
        console.log("api_url " + api_url)
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(latexData),
        });

        if (!response.ok) {
            console.error("Failed to compile LaTeX", await response.text());
            return;
        }

        // Get PDF as Blob
        const blob = await response.blob();

        // Create an object URL
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
  };
    
      useEffect(()=>{
        if (props.resume != null)
        {
            const latex = performTemplating()
            compileLatex(latex);
        }
      },[props.resume])

    return (
        <div className='p-4 bg-black flex flex-col justify-center'>
            <ThreeWaySlider options={["PDF", "LATEX"]}
                    value={level}
                    onChange={setLevel}
                    className="w-full" />
                {
                    (level == "PDF" && props.resume !== null) ?  
                        <PDFView pdfUrl={pdfUrl} /> : null
                }
                {
                    (level == "LATEX" && props.resume !== null) ?  
                        (
                            <div className="bg-red-600 min-h-200">
                                <SyntaxHighlighter className="min-h-full text-left" language="latex" style={atomOneDark}  >
                                    {latex}
                                </SyntaxHighlighter>
                            </div>
                        )
                        : null
                }
        </div>
    )
}