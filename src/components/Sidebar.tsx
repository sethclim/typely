import { ReactNode } from "react";
// import { PlusIcon } from "@heroicons/react/24/outline";
// import { ResumeConfigRow } from "../db/types";
// import { ResumeConfigTable } from "../db/tables";
// import { DocumentDuplicateIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/20/solid";
// import { PencilIcon } from "@heroicons/react/20/solid";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import { DuplicateResume } from "../db";
// import { DeleteModal } from "./DeleteModal";

type SidebarProps = {
    expanded : boolean,
    children : ReactNode
}

export function Sidebar({ children, expanded } : SidebarProps) {


  return (
    <>
      <aside
        className={`
          min-h-full border-r bg-dark flex flex-col transition-all duration-200
          ${expanded ? "w-64" : "w-0"}
        `}
      >
        <div className="flex items-center justify-between px-3 py-3">
          {expanded && (
              <span className="font-semibold text-grey">
                Typely
              </span>
            )}


        </div>

        {children}
        
      </aside>
    </>
  );
}
