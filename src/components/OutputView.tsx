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
import { hashString } from "../helpers/HashString";

import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { supabase } from "../helpers/SupabaseClient";

export type OutputViewProps = {
    resume? : ResumeConfig | null
}

export const OutputView = (props : OutputViewProps) => {

    const [level, setLevel] = useState("PDF");
    const [latex, setLatex] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const { user } = useUser();

    const [compile_count, setCompileCount] = useState(-1)
    const [compilesExceeded, setCompilesExceeded] = useState<boolean>(false);
    const [showLastCompiled, setShowLastCompiled] = useState<boolean>(false);

    useEffect(() => {
        const init = async() => {
            const { data: users } = await supabase
              .from('users')
              .select('compile_count')

            if(users)
                setCompileCount(users[0].compile_count)
        }
        init()
    }, [pdfUrl])

    const downloadPDF = () => {
        if(pdfUrl === null || props.resume === undefined || props.resume === null)
            return
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `${props.resume.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadLatex = () => {
       if(level === null || props.resume === undefined || props.resume === null)
            return

        const blob = new Blob([latex], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${props.resume.name}.tex`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke blob URL to free memory
        URL.revokeObjectURL(url);
    };

    const performTemplating = () => {

        let latex_string = `\\begin{document}`
        
        if(props.resume?.sections[1])
            ReplaceVariables(props.resume?.sections[1])

        props.resume?.sections.map((section) => {
            latex_string += ReplaceVariables(section)
        })
        latex_string += `\\end{document}`


        setLatex(latex_string)
        return latex_string
    
    };

    const compileLatex = async (uuid: string, latex : string) => {  
        // console.log(`!user ${!user} !props.resume ${!props.resume}`)
        if (!user || !props.resume)
            return
        const compileData = { 
            uuid: uuid,
            latex: latex 
        };
        const api_url = `${import.meta.env.VITE_BE_URL}/${import.meta.env.VITE_COMPILE_ENDPOINT}`
        console.log("api_url " + api_url)
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: getToken(),
            },
            body: JSON.stringify(compileData),
        });

        if (!response.ok) {
            const msg = (await response.text()).trim();
            console.error("Failed to compile LaTeX: ", msg);

            if(msg === "Max Free Compiles Exceeded"){
                setShowLastCompiled(false)
                setCompilesExceeded(true)
            }
            throw new Error("Max Free Compiles Exceeded")
        }

        // Get PDF as Blob
        const blob = await response.blob();

        const newHash = await hashString(latex);

        await savePDF(props.resume.id.toString(), newHash, blob);

        // Create an object URL
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    };

    
    useEffect(()=>{
        async function get(){
            if (props.resume != null)
            {
                const pdfData = await getPDF(props.resume.id.toString())
                const sty_source = props.resume.theme.sty_source
                const templatedLatexResume = performTemplating()

                // const docuClass = "\\documentclass[10pt, letterpaper]{article}"
                const latex = "".concat(sty_source, "\n", templatedLatexResume)
                
                const newHash = await hashString(latex);
                console.log(`pdfData ${JSON.stringify(pdfData)} newHash ${newHash}`)
                if(pdfData !== null && pdfData.hash === newHash)
                {
                    setPdfUrl(pdfData.url);
                }
                else{
                    console.log("calling compile")
                    try{
                        await compileLatex(props.resume.uuid, latex);
                    }
                    catch{
                        if(pdfData !== null)
                        {
                            setPdfUrl(pdfData.url);
                        }
                    }
                }
            }
        }
        get();
    },[props.resume])

    return (
        <div className='p-4 h-full bg-black flex flex-col justify-start'>
            <div className="flex justify-start">
                <div className="flex items-end grow">
                    <h3 className="text-mg text-mywhite p-2">{compile_count}/100</h3>
                </div>
                <button className="bg-white m-2 p-1 px-2 font-bold rounded-sm" onClick={downloadPDF}>
                    <div className="flex flex-row justify-between items-center">
                        PDF
                        <ArrowDownTrayIcon
                            className="h-3 w-3 ml-2 text-black"
                        />
                    </div>
                </button>
                <button className="bg-white m-2 p-1 px-2 font-bold rounded-sm" onClick={downloadLatex}>
                    <div className="flex flex-row justify-between items-center">
                        LATEX
                        <ArrowDownTrayIcon
                            className="h-3 w-3 ml-2 text-black"
                        />
                    </div>
                </button>
            </div>
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
                            ) : (
                                    (compilesExceeded && !showLastCompiled) ? (
                                        <div className="flex flex-col gap-2 p-4  justify-center items-center bg-dark mt-8">
                                            <h3 className="text-xl font-bold text-white">Free Compiles Exceeded</h3>
                                            <p className="text-white">Upgrade now for unlimited compiles!</p>
                                            <Link
                                                to="/pricing"
                                                className="bg-primary p-2 text-mywhite w-50 rounded-sm"
                                                >
                                                Buy Now
                                            </Link>
                                            <h3 className="text-grey"  >--------- OR ---------</h3>
                                            <span className="flex flex-row">
                                                <p className="text-white mr-2">See last compiled version:</p>
                                                <button className="text-blue-500" onClick={() => setShowLastCompiled(true)}>HERE</button>
                                            </span>
                                            <div className="w-full h-[1px] bg-grey/20 my-1" />
                                            <div className="flex flex-col items-center">
                                                <p className="text-white">You can always download the latex and compile locally, or on overleaf etc.</p>
                                                <span className="flex flex-row">
                                                    <p className="text-white mr-2">Please see our</p>                      
                                                    <Link
                                                        to="/faq"
                                                        className="text-blue-500  mr-2"
                                                        >
                                                        FAQ
                                                    </Link>
                                                    <p className="text-white">for more info</p>
                                                </span>
                                            </div>
                                        </div>
                                    ): <PDFView pdfUrl={pdfUrl} />
                            ) 
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