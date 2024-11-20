import React from "react"

interface GameModalProps {
    isOpen: boolean
    message: string
    onClose: () => void
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null

    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-pointer'
            onClick={onClose}
        >
            <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl'>
                <div className='text-center'>
                    <p className='text-xl mb-4'>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default GameModal
