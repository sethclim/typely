import { PlusIcon } from '@heroicons/react/24/outline'
import { ResumeConfigRow } from '../db/types'
import { DuplicateResume } from '../db'
import { useState } from 'react'
import { DeleteModal } from './DeleteModal'
import { useDataContext } from '../context/data/DataContext'
import { HoverMenu } from './HoverMenu'

type ResumeSidebarContentProps = {
	resumes: Array<ResumeConfigRow>
	activeId: number
	onSelect: (id: number) => void
	expanded: boolean
}

export const ResumeSidebarContent = ({ resumes, activeId, onSelect, expanded }: ResumeSidebarContentProps) => {
	const [rename, setRename] = useState(-1)
	const [newName, setNewName] = useState<string | null>(null)

	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [deleteResume, setDeleteResume] = useState<ResumeConfigRow | null>()

	const { repositories, dbService } = useDataContext()

	const createResume = () => {
		// console.log("CREATE")
		const uuid = crypto.randomUUID()
		repositories.resumeConfig.insert({
			uuid: uuid,
			name: 'New Resume',
			createdAt: Date.now().toString(),
			updatedAt: Date.now().toString(),
			themeId: 1
		})
	}

	const duplicateResume = (id?: number) => {
		if (id) {
			DuplicateResume(repositories, dbService, id)
		}
	}

	const onRename = (currentName: string, id?: number) => {
		if (id === undefined) return
		setRename(id)
		setNewName(currentName)
	}

	const onSubmit = () => {
		if (newName === null) return

		// console.log("ON SUBMIT")

		repositories.resumeConfig.updateName({
			id: rename,
			name: newName,
			updatedAt: Date.now().toString()
		})
		setRename(-1)
	}

	const onDelete = (resume?: ResumeConfigRow) => {
		if (!resume) return

		setDeleteResume(resume)
		setShowDeleteModal(true)
	}

	const performDeleteAction = () => {
		if (!deleteResume || !deleteResume.id) {
			console.error('No Delete Resume! ', JSON.stringify(deleteResume))
			return
		}

		repositories.resumeConfig.delete(deleteResume.id!)
		setShowDeleteModal(false)
		setDeleteResume(null)
	}

	return (
		<>
			<div className="p-3 border-t">
				<button
					onClick={createResume}
					className={`
              flex items-center gap-2 w-full py-2 rounded-md
              bg-primary/80 text-white hover:bg-primary justify-center
            `}
				>
					<PlusIcon className="h-5 w-5" />
					{expanded && 'New Resume'}
				</button>
			</div>

			{/* Header + toggle */}
			<div className="flex items-center justify-between px-3 py-3">
				{expanded && <span className="font-semibold text-grey">Resumes</span>}
			</div>

			{/* Resume list */}
			<div className="flex-1 overflow-y-auto space-y-1 px-2 pt-2">
				{resumes.map((r) => (
					<button
						key={r.id}
						onClick={() => onSelect(r.id!)}
						className={` group 
                flex justify-between items-center gap-2 w-full px-2 rounded-md text-left
                ${
					activeId === r.id
						? 'font-medium border-l-4 border-t-1 border-b-1  border-grey/20 hover:bg-darkest'
						: 'hover:bg-darkest'
				}
              `}
					>
						{/* <DocumentIcon className="h-5 w-5 text-gray-600 flex-shrink-0" /> */}
						{expanded ? (
							rename !== r.id ? (
								<span className="truncate text-grey">{r.name}</span>
							) : (
								<input
									value={newName!}
									className="text-black bg-gray-200"
									onChange={(e) => setNewName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											onSubmit()
										}
									}}
								/>
							)
						) : null}
						{/* Right side: permanent layout, only fade in */}
						<div
							className="
                  flex items-center gap-1
                  opacity-0 group-hover:opacity-100
                  pointer-events-none group-hover:pointer-events-auto
                  transition-opacity
                "
						>
							<HoverMenu
								resume={r}
								onRename={onRename}
								onDelete={onDelete}
								duplicateResume={duplicateResume}
							/>
						</div>
					</button>
				))}
			</div>

			<DeleteModal
				msg={`Are you sure you want to delete ${deleteResume?.name}?`}
				setIsOpen={setShowDeleteModal}
				isOpen={showDeleteModal}
				dangerAction={performDeleteAction}
			/>
		</>
	)
}
