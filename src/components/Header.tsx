import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid"
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid"
import clsx from "clsx"

export type HeaderProps = {
    expanded? : boolean
    setExpanded?: React.Dispatch<React.SetStateAction<boolean>>
    bg?: string
}

export const Header = ({expanded, setExpanded, bg="bg-darker"} : HeaderProps) =>{
    return(
        <div className={clsx(["flex w-full min-h-15 p-2 border-b-1 border-grey/20",  bg])}>
            <div className="flex flex-col justify-end mr-4">
                {
                    setExpanded ? (
                        <button
                            onClick={() => setExpanded!(!expanded)}
                            className="p-1"
                            >
                            {expanded ? (
                                <ChevronDoubleLeftIcon className="h-5 w-5 text-grey hover:text-mywhite" />
                            ) : (
                                <ChevronDoubleRightIcon className="h-5 w-5 text-grey hover:text-mywhite" />
                            )}
                        </button> ) : null
                }
            </div>
            <div className="flex flex-col justify-center">
                <h3 className="text-white text-3xl font-bold">TYPELY</h3>
            </div>
        </div>
    )
}