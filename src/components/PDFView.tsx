

import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ResumeConfig, ResumeSection } from '../types';

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type PDFViewProps = {
  resume : ResumeConfig | null
}

const ReplaceVariables = (section: ResumeSection) => {
  let str = section.template?.content || "";
  const dict = Object.fromEntries(section.items.flatMap(item => item.data));
  console.log("dict", dict);

  // Replace all {{KEY}} in one pass
  str = str.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    key = key.trim();
    const data = dict[key];
    console.log("Replacing", key, "with", data);
    return data ?? "";
  });

  console.log("Final str:", str);
  return str;
};

export const PDFView = (props : PDFViewProps) => {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const compileLatex = async () => {
    console.log(props.resume?.sections[0].template?.content)

    let latex_string = `\\documentclass[10pt, letterpaper]{article}\\usepackage{config}\\begin{document}`
    
    if(props.resume?.sections[1])
      ReplaceVariables(props.resume?.sections[1])

    props.resume?.sections.map((section) => {
      latex_string += ReplaceVariables(section)
    })
    latex_string += `\\end{document}`
    
    const latexData = { latex: latex_string };
    const api_url = `${import.meta.env.VITE_BE_URL}/${import.meta.env.VITE_COMPILE_ENDPOINT}`
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
      compileLatex()
  },[props.resume])

  return (
    <div>
      {/* <button className='text-white bg-red-500' onClick={compileLatex}>Compile LaTeX</button> */}

    {pdfUrl && (
      <Document file={pdfUrl}>
        <Page pageNumber={1} width={600} />
      </Document>
    )}
    </div>
  );
}