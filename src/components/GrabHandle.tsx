import clsx from "clsx"

export type GrabHandleProps = {
    dotColor? : string
}

export const GrabHandle = ({dotColor = "bg-grey"}:GrabHandleProps) => {
    return(
        <div className="flex flex-col gap-0.5 cursor-grab">
            <div className="flex gap-0.5">
                <div className={clsx(["w-1 h-1 rounded-full", dotColor])} />
                <div className={clsx(["w-1 h-1 rounded-full", dotColor])}  />
            </div>
            <div className="flex gap-0.5">
                <div className={clsx(["w-1 h-1 rounded-full", dotColor])}  />
                <div className={clsx(["w-1 h-1 rounded-full", dotColor])}  />
            </div>
            <div className="flex gap-0.5">
                <div className={clsx(["w-1 h-1 rounded-full", dotColor])}  />
                <div className={clsx(["w-1 h-1 rounded-full", dotColor])}  />
            </div>
        </div>
    )
}