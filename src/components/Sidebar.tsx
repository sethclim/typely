import { ReactNode } from "react";

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
