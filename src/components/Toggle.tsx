import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ReactNode } from 'react';
// import { ChevronUpIcon } from '@heroicons/react/20/solid';

type ToggleProps = {
    text: string
    children : ReactNode
}

export const Toggle = (props : ToggleProps) => {

  return (
    <div className="w-full">
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className="flex justify-between px-2 py-1 text-sm font-medium text-left text-white bg-black rounded-lg">
              <span>{props.text}</span>
              {/* <ChevronUpIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-purple-500`}
              /> */}
            </DisclosureButton>
            <DisclosurePanel className="pt-4">
              {props.children}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  );
}