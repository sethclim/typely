import { useState } from "react";
import { FolderIcon, PlusIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { ResumeConfigRow } from "../db/types";
import { ResumeConfigTable } from "../db/tables";

type SidebarProps = {
    resumes : Array<ResumeConfigRow>
    activeId : number,
    onSelect : (id : number) => void;
}

export function Sidebar({ resumes, activeId, onSelect } : SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  const createResume = () => {
    ResumeConfigTable.insert({
        "name" : "Fill In",
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })
  }

  return (
    <aside
      className={`
        h-screen border-r bg-gray-50 flex flex-col transition-all duration-200
        ${expanded ? "w-64" : "w-16"}
      `}
    >
            <div className="flex items-center justify-between px-3 py-3">
              {expanded && (
                  <span className="font-semibold text-gray-700">
                    Typely
                  </span>
                )}
              <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  {expanded ? (
                    <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDoubleRightIcon className="h-5 w-5 text-gray-600" />
                  )}
              </button>

            </div>

       {/* New button */}
      <div className="p-3 border-t">
        <button
          onClick={createResume}
          className={`
            flex items-center gap-2 w-full py-2 rounded-md
            bg-blue-600 text-white hover:bg-blue-500 justify-center
          `}
        >
          <PlusIcon className="h-5 w-5" />
          {expanded && "New Resume"}
        </button>
      </div>

      {/* Header + toggle */}
      <div className="flex items-center justify-between px-3 py-3">
        {expanded && (
          <span className="font-semibold text-gray-700">
            Resumes
          </span>
        )}

      </div>

      {/* Resume list */}
      <div className="flex-1 overflow-y-auto space-y-1 px-2">
        {resumes.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id!)}
            className={`
              flex items-center gap-2 w-full px-2 py-2 rounded-md text-left
              ${activeId === r.id
                ? "bg-white font-medium border-l-2 border-blue-500"
                : "hover:bg-gray-100"
              }
            `}
          >
            <DocumentIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
            {expanded && <span className="truncate text-black">{r.name}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
