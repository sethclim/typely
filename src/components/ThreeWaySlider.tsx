import { Radio, RadioGroup } from "@headlessui/react";
import clsx from "clsx";

export type ThreeWaySliderProps = {
  options: string[];              // e.g. ["Low", "Medium", "High"]
  value: string;                  // currently selected option
  onChange: (value: string) => void;
  className?: string;             // optional wrapper class
};

export default function ThreeWaySlider({
  options,
  value,
  onChange,
  className = "",
}: ThreeWaySliderProps) {
  const index = options.indexOf(value);

  return (
    <RadioGroup value={value} onChange={onChange} className={className}>
      <div className="relative h-10 bg-dark flex items-center px-2">
        {/* Slider indicator */}
        <div
          className={clsx(
            "absolute top-1 bottom-1 w-1/3 rounded-50 bg-darkest transition-all duration-200",
            {
              "left-1": index === 0,
              "left-1/3": index === 1,
              "left-2/3": index === 2,
            }
          )}
          style={{
            width: `${100 / options.length}%`,
            left: `${(100 / options.length) * index}%`,
          }}
        />

        {/* Option segments */}
        <div className="flex w-full h-full">
          {options.map((opt) => (
            <Radio
              key={opt}
              value={opt}
              className="flex-1 flex items-center justify-center z-10 cursor-pointer select-none text-sm "
            >
              {({ checked }) => (
                <span
                  className={
                    checked ? "text-mywhite font-semibold" : "text-grey"
                  }
                >
                  {opt}
                </span>
              )}
            </Radio>
          ))}
        </div>
      </div>
    </RadioGroup>
  );
}
