import { Portal, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { useRef, useState } from "react"

export type DropdownProps = {
  options: string[]
  onSelected: (v: string) => void
}

export function Dropdown({ options, onSelected }: DropdownProps) {
  const [value, setValue] = useState(options[0])

  return (
    <Listbox value={value} onChange={(v) => { setValue(v); onSelected(v) }}>
      <div className="relative min-w-30">
        <ListboxButton className="w-full border px-3 py-2 bg-dark text-left">
          {value}
        </ListboxButton>

        <Portal>
          <ListboxOptions
            anchor="bottom start"
            className="
              z-[9999]
              mt-1 w-56
              rounded border bg-darkest shadow-lg
            "
          >
            {options.map((t) => (
              <ListboxOption
                key={t}
                value={t}
                className="cursor-pointer px-3 py-2 hover:bg-dark text-mywhite"
              >
                {t}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Portal>
      </div>
    </Listbox>
  )
}