import { useEffect, useState } from "react";
import ThreeWaySlider from "./ThreeWaySlider"
import { PDFView, ReplaceVariables } from "./PDFView";
import { ResumeConfig } from "../types";

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Link } from "@tanstack/react-router";
import { getToken } from "../helpers/GetToken";
import { useUser } from "../context/user/UserContext";
import { getPDF, savePDF } from "../services/PDFStorageManager";

export type OutputViewProps = {
    resume? : ResumeConfig | null
}

export const OutputView = (props : OutputViewProps) => {

    const [level, setLevel] = useState("PDF");
    const [latex, setLatex] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const { user } = useUser();

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
        if (!user || !props.resume)
            return
        const latexData = { latex: latex };
        const api_url = `${import.meta.env.VITE_BE_URL}/${import.meta.env.VITE_COMPILE_ENDPOINT}`
        console.log("api_url " + api_url)
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: getToken(),
            },
            body: JSON.stringify(latexData),
        });

        if (!response.ok) {
            console.error("Failed to compile LaTeX", await response.text());
            return;
        }

        // Get PDF as Blob
        const blob = await response.blob();

        await savePDF(props.resume.name, blob);

        // Create an object URL
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    };

    
    useEffect(()=>{
        async function get(){
            if (props.resume != null)
            {
                const pdfURL = await getPDF(props.resume.name)
                const latex = performTemplating()
                if(pdfURL)
                {
                    setPdfUrl(pdfURL);
                }
                else{
                    compileLatex(latex);
                }
            }
        }
        get();
    },[props.resume])

    return (
        <div className='p-4 h-full bg-black flex flex-col justify-start'>
            <ThreeWaySlider options={["PDF", "LATEX"]}
                    value={level}
                    onChange={setLevel}
                    className="w-full" />
                {
                    (level == "PDF") ? (
                        <>
                        {
                            (!user) ? (
                                <div className="flex h-full w-full justify-center items-center">
                                    <Link
                                        to="/login"
                                        activeProps={{
                                            className: 'font-bold',
                                        }}
                                        >
                                            <div className="bg-purple-500 text-white p-2 rounded-sm">
                                                Login To Compile
                                            </div>
                                    </Link>
                                </div>
                            ):  <PDFView pdfUrl={pdfUrl} />
                        }
                        </>
                    )   : null
                }
                {
                    (level == "LATEX" && props.resume !== null) ?  
                        (
                            <div className="min-h-200">
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