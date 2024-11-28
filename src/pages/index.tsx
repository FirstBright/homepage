import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
    BoardType,
    checkWinner,
    getBestMove,
    getRandomImage,
} from "@/utils/GameLogic"
import Board from "@/components/GameBoard"
import StatusBar from "@/components/StatusBar"
import GameModal from "@/components/GameModal"

interface ModalState {
    isOpen: boolean
    message: string
    action: () => void
}

const TicTacToe = () => {
    const [board, setBoard] = useState<BoardType>(Array(9).fill(null))
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [rounds, setRounds] = useState(0)
    const [winner, setWinner] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [hearts, setHearts] = useState(2)
    const [drawCount, setDrawCount] = useState(0)
    const [gameEnded, setGameEnded] = useState(false)
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        message: "",
        action: () => {},
    })
    const router = useRouter()

    useEffect(() => {
        if (!isPlayerTurn && !gameEnded && !winner && !isProcessing) {
            const timeoutId = setTimeout(() => {
                handleComputerMove()
            }, 500)
            return () => clearTimeout(timeoutId)
        }
    }, [isPlayerTurn, gameEnded, winner, isProcessing, board])

    const handleComputerMove = async () => {
        if (isProcessing || winner || gameEnded) return

        setIsProcessing(true)
        const bestMove = getBestMove(board)

        if (bestMove !== -1) {
            makeMove(bestMove, "cat")
        }
        setIsProcessing(false)
    }

    const makeMove = (idx: number, playerType: "cat" | "dog") => {
        if (board[idx] !== null || winner || isProcessing || gameEnded) return

        const newBoard = [...board]
        newBoard[idx] = getRandomImage(playerType)
        setBoard(newBoard)
        setIsPlayerTurn((prev) => !prev)
        const gameWinner = checkWinner(newBoard)
        if (gameWinner) {
            setWinner(gameWinner)
            handleGameEnd(gameWinner)
            return
        }

        // Check for draw
        if (!newBoard.includes(null)) {
            handleGameEnd("draw")
            return
        }
    }

    const resetGame = () => {
        const newRounds = rounds + 1

        // Reset all game states
        setBoard(Array(9).fill(null))
        setWinner(null)

        setIsProcessing(false)
        setGameEnded(false)
        setRounds(newRounds)
    }

    const handleGameEnd = (gameWinner: string) => {
        if (gameEnded) return

        setGameEnded(true)
        setWinner(gameWinner)

        // Use setTimeout to ensure state updates have completed
        setTimeout(() => {
            if (gameWinner === "cat") {
                if (hearts <= 1) {
                    showModal(
                        "Computer Wins! No hearts left. Resetting the game!",
                        () => {
                            setHearts(2)
                            setDrawCount(0)
                            resetGame()
                        }
                    )
                } else {
                    showModal("Computer Wins! 🤖", () => {
                        setHearts((prev) => prev - 1)
                        resetGame()
                    })
                }
            } else if (gameWinner === "dog") {
                showModal("You Win! 🎉", () => resetGame())
            } else {
                // Handle draw
                const newDrawCount = drawCount + 1
                setDrawCount(newDrawCount)

                if (newDrawCount >= 2) {
                    showModal(
                        "Two draws! Redirecting to the mondrian page.",
                        () => {
                            router.push("/mondrian")
                        }
                    )
                } else {
                    showModal("It's a Draw! 🤝", () => resetGame())
                }
            }
        }, 100)
    }
    const showModal = (message: string, action: () => void) => {
        setModal({
            isOpen: true,
            message,
            action: () => {
                setModal((prev) => ({ ...prev, isOpen: false }))
                setTimeout(() => {
                    action()
                }, 50)
            },
        })
    }
    const handleClick = (idx: number) => {
        if (isPlayerTurn && !gameEnded && !winner && !isProcessing) {
            makeMove(idx, "dog")
        }
    }

    return (
        <div className='text-center py-10'>
            <Board
                board={board}
                handleClick={handleClick}
                disabled={
                    !isPlayerTurn || isProcessing || !!winner || gameEnded
                }
            />
            <div className='flex flex-row justify-center mt-5'>
                <div className='flex mr-20'>
                    {[...Array(2)].map((_, i) => (
                        <input
                            key={i}
                            type='checkbox'
                            checked={i < drawCount}
                            readOnly
                            className='mr-2'
                        />
                    ))}
                </div>

                <div className='flex ml-20'>
                    {[...Array(hearts)].map((_, i) => (
                        <svg
                            key={i}
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            className='w-5 h-5 text-red-500'
                            fill={i < hearts ? "currentColor" : "none"}
                            stroke='currentColor'
                        >
                            <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                        </svg>
                    ))}
                </div>
            </div>

            <StatusBar
                winner={winner}
                onReset={resetGame}
                isPlayerTurn={isPlayerTurn}
                isProcessing={isProcessing}
            />

            <GameModal
                isOpen={modal.isOpen}
                message={modal.message}
                onClose={modal.action}
            />
        </div>
    )
}

export default TicTacToe
