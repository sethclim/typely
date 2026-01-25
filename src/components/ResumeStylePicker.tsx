import { useState } from "react";
import { Theme } from "../types";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

export type ResumeStylePickerProps = {
  onSelect?: (style: Theme) => void;
  themes : Array<Theme>
}

export default function ResumeStylePicker(props: ResumeStylePickerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const pick = (theme: Theme) => {
    setSelected(theme.name);
    props.onSelect?.(theme);
  };

  const baseCard =
    "relative cursor-pointer rounded-2xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl transition-all duration-300  hover:shadow-2xl";

  const selectedRing =
    "ring-2 ring-purple-500 bg-white/20";

  return (
   <div className="w-full max-w-[1700px] mx-auto py-10">
    <h2 className="text-2xl font-semibold text-white mb-6">
      Choose your resume style
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {props.themes.map(theme => (
        <div
          key={theme.name}
          id={`${theme.name}-card`}
          onClick={() => pick(theme)}
          className={`${baseCard} ${
            selected === theme.name ? selectedRing : ""
          } relative overflow-hidden`}
        >
          {/* glow / background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-500/10 pointer-events-none z-0" />

          {/* content */}
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-2">
              {theme.name}
            </h3>

            <Document key={`/${theme.name}.pdf`} className="bg-black w-full" file={`/${theme.name}.pdf`} >
              <Page pageNumber={1}  className="overflow-hidden" width={250} scale={2} />
            </Document>
          </div>
        </div>
      ))}
    </div>
  </div>

  );
}
