import React from "react"

interface StatusBarProps {
    winner: string | null
    onReset: () => void
    isPlayerTurn: boolean
    isProcessing: boolean
}

const StatusBar: React.FC<StatusBarProps> = ({
    winner,
    onReset,
    isPlayerTurn,
    isProcessing,
}) => {
    const getStatusText = () => {
        if (winner) {
            if (winner === "cat") return "You Win! 🎉"
            if (winner === "dog") return "Computer Wins! 🤖"
            return "It's a Draw! 🤝"
        }
        if (isProcessing) return "Computer is thinking... 🤔"
        return isPlayerTurn ? "Your Turn! 😺" : "Computer's Turn! 🐕"
    }

    return (
        <div className='mt-6 space-y-4'>
            <div className='text-xl font-semibold animate-pulse'>
                {getStatusText()}
            </div>
            {winner && (
                <button
                    onClick={onReset}
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg 
                             hover:bg-blue-600 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                    Play Again
                </button>
            )}
        </div>
    )
}

export default StatusBar
