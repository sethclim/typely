import { MouseEventHandler, ReactNode } from "react";

export type SectionProps = {
    title : string
    children : ReactNode
}
export const Section = ({ title, children }: SectionProps) => (
  <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 space-y-4 shadow-xl">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

import { XMarkIcon } from "@heroicons/react/24/solid"

export type CardProps = {
    children : ReactNode
    onClose?: () => void
}
export const Card = ({ children, onClose }: CardProps) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
    {
      onClose ? (
        <div className="w-full h-full relative flex justify-end">
          <button
            onClick={onClose}
            className="p-1 rounded group"
          >
            <XMarkIcon className="h-5 w-5 hover:text-black" />
          </button>
        </div>
      ):  null
    }
    {children}
  </div>
);

export type InputProps = {
    label : string 
    value : string | undefined
    onChange : (v : string) => void
}

export const Input = ({ label, value, onChange }: InputProps) => (
  <div className="flex flex-col items-center">
    <label className="text-sm text-white/70">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

export const Textarea = ({ label, value, onChange }: InputProps) => (
  <div>
    <label className="text-sm text-white/70">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={4}
      className="w-full mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

export type AddButtonProps = {
    onClick : MouseEventHandler<HTMLButtonElement> | undefined
    children : ReactNode
}
export const AddButton = ({ children, onClick }: AddButtonProps) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 transition"
  >
    {children}
  </button>
);
