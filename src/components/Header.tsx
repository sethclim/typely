import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid"
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid"

export type HeaderProps = {
    expanded? : boolean
    setExpanded?: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header = (props : HeaderProps) =>{
    return(
        <div className="flex w-full bg-darker min-h-15 p-2 border-b-1 border-grey/20">
            <div className="flex flex-col justify-end mr-4">
                {
                    props.setExpanded ? (
                        <button
                            onClick={() => props.setExpanded!(!props.expanded)}
                            className="p-1"
                            >
                            {props.expanded ? (
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