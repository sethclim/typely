import { useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";

// const options = ["Apple", "Banana", "Orange"];

type ComboBoxProps = {
    options : Array<string>,
    selected: string | null;
    onSelectedChange: (value: string | null) => void;
}

export default function ComboBox(props : ComboBoxProps) {
  const [query, setQuery] = useState("");
//   const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState(props.options);

  const filtered =
    query === ""
      ? items
      : items.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        );

  const allowCreate = query.length > 0 && !items.includes(query);

  function handleCreate() {
    setItems([...items, query]);
    props.onSelectedChange(query);
  }

  return (
    <div className="w-64 text-mywhite my-2">
      <Combobox value={props.selected} onChange={props.onSelectedChange}>
        <div className="relative">
          <ComboboxInput
            className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select or create..."
            onChange={(e) => setQuery(e.target.value)}
            displayValue={(v: string) => v}
          />

          <ComboboxOptions
            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg
                       bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            {filtered.length === 0 && !allowCreate && (
              <div className="cursor-default px-4 py-2 text-gray-500">
                No results
              </div>
            )}

            {filtered.map((item) => (
              <ComboboxOption
                key={item}
                value={item}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? "bg-blue-600 text-white" : "text-gray-900"
                  }`
                }
              >
                {item}
              </ComboboxOption>
            ))}

            {allowCreate && (
              <div
                onClick={handleCreate}
                className="cursor-pointer px-4 py-2 text-blue-600 hover:bg-blue-100"
              >
                Create “{query}”
              </div>
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
}
