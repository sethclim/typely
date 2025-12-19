import { useState, useRef } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { ResumeSectionConfigTable } from "../db/tables";
import { DeleteModal } from "./DeleteModal";
import { ResumeSection } from "../types";

type SectionContextMenuProps = {
    section: ResumeSection;
};

export const SectionContextMenu = (props: SectionContextMenuProps) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteSection, setDeleteSection] = useState<ResumeSection>()

    const deleteSectionFromResume = (section: ResumeSection) => {
        // ResumeSectionConfigTable.delete(section_id);
        setDeleteSection(section)
        setShowDeleteModal(true)
        setOpen(false); // close menu after deletion
    };

    const performDeleteAction = () => {
        if(deleteSection)
            ResumeSectionConfigTable.delete(deleteSection.id)
    }

    return (
        <>
            <div className="relative inline-block">
                {/* Context button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="p-1 rounded focus:outline-none"
                >
                    <EllipsisVerticalIcon className="w-5 h-5 text-grey/80 hover:text-mywhite" />
                </button>

                {/* Dropdown menu */}
                {open && (
                    <div
                        ref={menuRef}
                        className="absolute top-full left-0 mt-1 w-40 bg-white rounded shadow-md z-10"
                        onMouseLeave={() => setOpen(false)} // only triggers when mouse leaves menu itself
                    >
                        <button
                            className="w-full text-left px-4 py-2 bg-darker text-red-600 hover:bg-dark"
                            onClick={() => deleteSectionFromResume(props.section)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <DeleteModal 
                msg={`Are you sure you want to delete ${deleteSection?.title}?`}
                setIsOpen={setShowDeleteModal} 
                isOpen={showDeleteModal} 
                dangerAction={performDeleteAction}  />
        </>
    );
};
