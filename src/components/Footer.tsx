import { Link } from "@tanstack/react-router"
import clsx from "clsx"

export type FooterProps ={
    bg?: string
}

export const Footer = ({bg = "bg-darkest"} : FooterProps) =>{
    return(
        <div className={clsx(["flex flex-col w-full justify-center items-center min-h-10 gap-2 p-2 border-t-1 border-grey/20", bg])}>
            <p className="text-white">@sethclim 2025</p>
            <ul className="flex flex-row gap-8 text-primary/80 list-disc pl-5">
                <li>
                    <Link to="/faq" className="text-primary/80 hover:text-primary brightness-120">
                    FAQ
                    </Link>
                </li>
                 <li>
                    <Link to="/pricing" className="text-primary/80 hover:text-primary brightness-120">
                    PRICING
                    </Link>
                </li>
            </ul>
        </div>
    )
}