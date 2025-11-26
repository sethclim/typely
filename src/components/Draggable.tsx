import { ReactNode } from 'react';
import {Data, useDraggable} from '@dnd-kit/core';

type DraggableProps<T> = {
    dragId : string
    children : ReactNode
    data? : T
}

export function Draggable<T extends Data>(props : DraggableProps<T>) {
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: props.dragId,
    data: props.data
  });


//   const style = transform ? {
//     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
//   } : undefined;

  
  return (
    <div className='hover:cursor-pointer z-50' ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}   