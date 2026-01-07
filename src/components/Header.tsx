import { ReactNode } from "react"
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid"
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid"
import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { Listbox, ListboxButton, Portal, ListboxOptions, ListboxOption } from "@headlessui/react"

export type HeaderProps = {
    expanded? : boolean
    setExpanded?: React.Dispatch<React.SetStateAction<boolean>>
    bg?: string
    children? : ReactNode
}

export const Header = ({expanded, setExpanded, children, bg="bg-darker"} : HeaderProps) =>{
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
                <Link to="/app" >
                    <h3 className="text-white text-3xl font-bold">TYPELY</h3>
                </Link>
            </div>
            <div className="grow">
                {children}
            </div>
            {/* <button className="bg-white w-10 h-10 rounded-full">
                
            </button> */}

              <Listbox value={"HAHA"} >
                <div className="relative min-w-30 ">
                  <ListboxButton className="border bg-white w-10 h-10 rounded-full text-left">
                    <div className="flex justify-center">
                        <h3 className="font-bold">S</h3>
                    </div>
                  </ListboxButton>
            
                  <Portal>
                    <ListboxOptions
                      anchor="bottom end"
                      className="
                        z-[9999]
                        mt-1 w-56
                        rounded border bg-darkest shadow-lg
                      "
                    >
                        <Link to="/app">
                            <ListboxOption
                            value="Profile"
                            className="cursor-pointer px-3 py-2 hover:bg-dark text-mywhite"
                            >
                                Home
                            </ListboxOption>
                        </Link>
                        <Link to="/settings">
                            <ListboxOption
                            value="Profile"
                            className="cursor-pointer px-3 py-2 hover:bg-dark text-mywhite"
                            >
                                Settings
                            </ListboxOption>
                        </Link>
                    </ListboxOptions>
                  </Portal>
                </div>
              </Listbox>
        
        </div>
    )
}