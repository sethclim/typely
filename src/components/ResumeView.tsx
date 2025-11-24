

import { useState } from 'react'

import { useResume } from '../context/resume/ResumeContext'
import { ResumeSectionConfigTable } from '../db/tables';

import Modal from "./Modal";
import ComboBox from './ComboBox';

import { ResumeTemplateDisplay } from './ResumeTemplateDisplay'
import { ComponentLibrary } from './ComponentLibrary';

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ResumeConfig } from '../types';

type PDFViewProps = {
  resume : ResumeConfig | null
}

const PDFView = (props : PDFViewProps) => {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const compileLatex = async () => {
    console.log(props.resume?.sections[0].template?.content)

    let latex_string = `\\documentclass{article}\\begin{document}`
    
    props.resume?.sections.map((section) => {
      latex_string += section.template?.content
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

  return (
    <div>
      <button className='text-white bg-red-500' onClick={compileLatex}>Compile LaTeX</button>

    {pdfUrl && (
      <Document file={pdfUrl}>
        <Page pageNumber={1} width={600} />
      </Document>
    )}
    </div>
  );
}

export const ResumeView = () => {
  const { resume: myResume } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const createResumeComponent = () => {
    if (myResume === null || selected == null)
      return;

    ResumeSectionConfigTable.insert({
      "id": 3,
      "resume_id": myResume!.id,
      "template_id": -1,
      "section_order": 0, //TODO needs to be the last one in the list
      "section_type": selected!
    })

    setSelected(null);
    setIsOpen(false);
  }

  return (
    <>
      <div className='flex flex-row w-lvw justify-start bg-white p-4 gap-2'>
        {/* <FileListDisplay files={files} /> */}
        <ComponentLibrary />
        <div className='bg-black'>
          <h3 className='text-4xl font-extrabold text-white'>{myResume?.name}</h3>
          <div className='flex flex-col gap-4 w-150 p-4'>
          {
            myResume?.sections.map((section) => {
              return <ResumeTemplateDisplay key={section.id} resumeSection={section} /> 
            })
          }
          <button onClick={() => setIsOpen(true)}>Add New Component</button>
          </div>
        </div>
        
        <PDFView resume={myResume} />

         <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">New Resume Block</h2>uik
          <form>
            <p className="text-black">Type</p>
            <ComboBox selected={selected} onSelectedChange={setSelected} options={["Skills"]} />
          </form>
          <div className='flex flex-row gap-4'>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => createResumeComponent()}
            >
              Create
            </button>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}