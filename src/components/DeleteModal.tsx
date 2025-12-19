import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";



export type DeleteModalProps = {
    isOpen: boolean;
    setIsOpen : Dispatch<SetStateAction<boolean>>
    msg : string
    dangerAction :  () => void
}

export const DeleteModal = (props : DeleteModalProps) => {
    return(
        <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)} width="w-120">
            <div className="flex flex-col justify-center items-center">
                <h3 className="text-mywhite text-lg">{props.msg}</h3>
                 <div className='flex flex-row gap-4'>
                    <button
                        className="mt-4 px-4 py-2 bg-grey hover:bg-mywhite text-red-500 rounded font-bold"
                        onClick={() => props.dangerAction()}
                    >
                        DELETE
                    </button>
                    <button
                        className="mt-4 px-4 py-2 bg-grey hover:bg-mywhite text-darkest rounded font-bold"
                        onClick={() => props.setIsOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}