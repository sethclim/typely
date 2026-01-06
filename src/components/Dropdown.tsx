import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { useState } from "react"

export type DropdownProps = {
  options: string[]
  onSelected: (v: string) => void
}

export function Dropdown({ options, onSelected }: DropdownProps) {
  const [value, setValue] = useState(options[0])

  const onValueSet = (v: string) => {
    setValue(v)
    onSelected(v)
  }

  return (
    <Listbox value={value} onChange={onValueSet}>
      <div className="relative inline-block w-56">
        <ListboxButton className="w-full border px-3 py-2 text-left rounded bg-dark">
          {value}
        </ListboxButton>

        <ListboxOptions
          className="
            absolute z-50 mt-1 w-full
            rounded border bg-darkest shadow-lg
            max-h-60 overflow-auto
          "
        >
          {options.map((t) => (
            <ListboxOption
              key={t}
              value={t}
              className={({ active }) =>
                `cursor-pointer px-3 py-2 ${
                  active ? "bg-dark" : ""
                }`
              }
            >
              {t}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}