import { Block } from "../App"

type componentLibraryProps = {
    latex_comps : Array<Block>
}

export const ComponentLibrary = (props : componentLibraryProps) => {



    return (
        <div className="flex flex-col w-200">
            <h3 className="text-xl text-bold">Component Library</h3>
            <div className="flex flex-col gap-4">
                {
                    props.latex_comps.map((comp, index) => {
                        return (
                            <div className="max-h-20 text-black text-ellipsis overflow-hidden bg-white/40">
                                <h3 className="text-xl text-bold">{comp.name}</h3>
                                <p className="max-h-40 text-ellipsis">{comp.content}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}