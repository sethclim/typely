import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ReactNode } from 'react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

type ToggleProps = {
    text?: string
    children : ReactNode,
    barContents: ReactNode;
    postBarContent?: ReactNode;
}

export const Toggle = (props : ToggleProps) => {

  return (
    <div className="flex flex-col flex-1 w-full">
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className="flex justify-between items-center px-2 py-1 text-sm font-medium text-left text-white bg-black rounded-sm">
              {props.barContents}
              <ChevronUpIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-purple-500`}
              />
              {props.postBarContent}
            </DisclosureButton>
            <DisclosurePanel className="pt-4 bg-black p-2">
              {props.children}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  );
}