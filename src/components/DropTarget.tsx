import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export type DropTargetProps = {
	id: number
}

export const DropTarget = (props: DropTargetProps) => {
	const { isOver, setNodeRef, active } = useDroppable({
		id: `sectionT-${props.id}`,
		data: { index: props.id }
	})

	const [bgColor, setBGColor] = useState('border-dark')

	useEffect(() => {
		isOver && active?.id.toString().startsWith('sectioninstance-')
			? setBGColor('border-other/80')
			: setBGColor('border-dark')
	}, [isOver])

	return (
		<div ref={setNodeRef} className="p-2">
			<hr className={clsx(bgColor, 'border-solid border-1 h-[2px] my-0')} />
		</div>
	)
}
