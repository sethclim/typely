import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ReactNode } from 'react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

type ToggleProps = {
    children : ReactNode,
    barContents: ReactNode;
    postBarContent?: ReactNode;
    buttonStyle?: string;
    panelStyle?: string;
}

export const Toggle = ({
  children, 
  barContents, 
  postBarContent, 
  buttonStyle = "flex justify-between items-center px-2 py-1 text-sm font-medium text-left text-white bg-black rounded-sm",
  panelStyle = "pt-4 bg-black p-2"
} : ToggleProps) => {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className={buttonStyle}>
              {barContents}
              <ChevronUpIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-purple-500`}
              />
              {postBarContent}
            </DisclosureButton>
            <DisclosurePanel className={panelStyle}>
              {children}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  );
}