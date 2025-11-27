import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ResumeSection } from '../types';

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type PDFViewProps = {
  pdfUrl? : string | null
}

export const ReplaceVariables = (section: ResumeSection) => {
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

  return (
    <div>
    {props.pdfUrl && (
      <Document className="bg-black" file={props.pdfUrl}>
        <Page pageNumber={1} width={600} />
      </Document>
    )}
    </div>
  );
}