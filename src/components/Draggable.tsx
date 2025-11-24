import { ReactNode } from 'react';
import {useDraggable} from '@dnd-kit/core';

type DraggableProps = {
    dragId : string
    children : ReactNode
}

export function Draggable(props : DraggableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.dragId,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <div className='hover:cursor-pointer z-50' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}