import { EllipsisVerticalIcon, PencilIcon, DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import { ResumeConfigRow } from "../db/types";

type HoverMenuProps = {
    resume : ResumeConfigRow,
    onDelete: (resume?: ResumeConfigRow | undefined) => void,
    onRename: (currentName: string, id?: number | undefined) => void
    duplicateResume: (id?: number | undefined) => void
}

export const HoverMenu = ({ resume, onRename, duplicateResume, onDelete }: HoverMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const openMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation();
        setIsOpen(true)
    }

    return (
        <div className="relative" ref={containerRef}    onMouseLeave={() => setIsOpen(false)}>
            <button  onClick={openMenu}
                className="p-3 rounded opacity-30 hover:opacity-100 transition-opacity duration-200 "
            >
                <EllipsisVerticalIcon className="h-5 w-5 text-grey" />
            </button>
            <div
                onMouseLeave={() => setIsOpen(false)}
                className={`absolute right-0 mt-0 w-36 z-20`}
            >
                {isOpen && (
                <div className="rounded-md bg-darker shadow-lg border focus:outline-none">
                        <button
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-grey hover:bg-dark`}
                            onClick={() => {
                                onRename(resume.name, resume.id ?? undefined);
                                setIsOpen(false);
                            }}
                        >
                            <PencilIcon className="h-4 w-4" />
                            Rename
                        </button>
                        <button
                            className={` flex w-full items-center gap-2 px-3 py-2 text-left text-grey hover:bg-dark`}
                            onClick={() => {
                                duplicateResume(resume.id ?? undefined);
                                setIsOpen(false);
                            }}
                        >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                            Duplicate
                        </button>
                        <button
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-dark` }
                            onClick={() => {
                                onDelete(resume);
                                setIsOpen(false);
                            }}
                        >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                        </button>
                </div>
                )}
            </div>
        </div>
    );
}