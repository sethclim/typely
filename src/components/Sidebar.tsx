import { useState } from "react";
import { PlusIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { ResumeConfigRow } from "../db/types";
import { ResumeConfigTable } from "../db/tables";
import { DocumentDuplicateIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/20/solid";
import { PencilIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DuplicateResume } from "../db";

type SidebarProps = {
    resumes : Array<ResumeConfigRow>
    activeId : number,
    onSelect : (id : number) => void;
}

export function Sidebar({ resumes, activeId, onSelect } : SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [rename, setRename] = useState(-1)
  const [newName, setNewName] = useState<string | null>(null)

  const createResume = () => {
    ResumeConfigTable.insert({
        "name" : "New Resume",
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })
  }

  const duplicateResume = (id? : number) => {
    if(id)
      DuplicateResume(id)
  }

  const onRename = (currentName : string, id? : number) => {
    if (id === undefined)
      return
    setRename(id)
    setNewName(currentName)
  }

  const onSubmit = () => {
    if(newName === null)
      return

    console.log("ON SUBMIT")

    ResumeConfigTable.update({
        "id": rename,
        "name" : newName,
        "updated_at" : Date.now().toString(),
    })
    setRename(-1)
  }

  const onDelete = (id? : number) => {
    if(!id)
      return
    ResumeConfigTable.delete(id)
  }

  return (
    <aside
      className={`
        h-full border-r bg-gray-50 flex flex-col transition-all duration-200
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
      <div className="flex-1 overflow-y-auto space-y-1 px-2 pt-2">
        {resumes.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id!)}
            className={` group 
              flex justify-between items-center gap-2 w-full px-2 py-2 rounded-md text-left
              ${activeId === r.id
                ? "bg-white font-medium border-l-2 border-blue-500 hover:bg-gray-300" 
                : "hover:bg-gray-300"
              }
            `}
          >
            <DocumentIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
            { expanded ? (
              (rename !== r.id)  ? <span className="truncate text-black">{r.name}</span> : (
                <input value={newName!} className="text-black bg-gray-200" onChange={(e) => setNewName(e.target.value)}  onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSubmit();
                  }
                }} />
              ) 
              ) : null

            }
             {/* Right side: permanent layout, only fade in */}
              <div className="
                flex items-center gap-1
                opacity-0 group-hover:opacity-100
                pointer-events-none group-hover:pointer-events-auto
                transition-opacity
              ">
                <Menu as="div" className="relative">
                  <MenuButton className="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </MenuButton>

                  <MenuItems
                    className="
                      absolute right-0 mt-1 w-36 rounded-md bg-white shadow-lg border
                      focus:outline-none z-20
                    "
                  >
                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex w-full items-center gap-2 px-3 py-2 text-left text-black`}
                          onClick={() => onRename(r.name, r.id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                          Rename
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex w-full items-center gap-2 px-3 py-2 text-left text-black`}
                          onClick={() => duplicateResume(r.id)}
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                          Duplicate
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex w-full items-center gap-2 px-3 py-2 text-red-600 text-lef text-blackt`}
                          onClick={() => onDelete(r.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
