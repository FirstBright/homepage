import React from "react"
import Image from "next/image"

interface CellProps {
    value: string | null
    onClick: () => void
    disabled?: boolean
}

const Cell: React.FC<CellProps> = ({ value, onClick, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-24 h-24 bg-white rounded-lg shadow-md 
                flex items-center justify-center
                transition-all duration-200
                ${
                    disabled
                        ? "cursor-not-allowed opacity-80"
                        : "hover:bg-gray-50 hover:shadow-lg"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
        >
            {value && (
                <div className='relative w-20 h-20'>
                    <Image
                        src={value}
                        alt='Game piece'
                        fill
                        className='object-contain'
                        sizes='(max-width: 80px) 100vw, 80px'
                    />
                </div>
            )}
        </button>
    )
}

export default Cell
