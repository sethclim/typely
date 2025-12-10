import { useState, useRef } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { ResumeSectionConfigTable } from "../db/tables";

type SectionContextMenuProps = {
    section_id: number;
};

export const SectionContextMenu = (props: SectionContextMenuProps) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const deleteSectionFromResume = (section_id: number) => {
        ResumeSectionConfigTable.delete(section_id);
        setOpen(false); // close menu after deletion
    };

    return (
        <div className="relative inline-block">
            {/* Context button */}
            <button
                onClick={() => setOpen(!open)}
                className="p-1 rounded hover:bg-gray-200 focus:outline-none"
            >
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown menu */}
            {open && (
                <div
                    ref={menuRef}
                    className="absolute top-full left-0 mt-1 w-40 bg-white border rounded shadow-md z-10"
                    onMouseLeave={() => setOpen(false)} // only triggers when mouse leaves menu itself
                >
                    <button
                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                        onClick={() => deleteSectionFromResume(props.section_id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};
