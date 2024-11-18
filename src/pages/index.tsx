import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
    BoardType,
    checkWinner,
    getBestMove,
    getRandomImage,
} from "@/components/GameLogic"
import Board from "@/components/GameBoard"
import StatusBar from "@/components/StatusBar"

const TicTacToe: React.FC = () => {
    const [board, setBoard] = useState<BoardType>(Array(9).fill(null))
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [rounds, setRounds] = useState(0)
    const [winner, setWinner] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!isPlayerTurn && !winner && !isProcessing) {
            handleComputerMove()
        }
    }, [isPlayerTurn, winner])

    const handleComputerMove = async () => {
        setIsProcessing(true)
        // Add small delay to make computer moves feel more natural
        await new Promise((resolve) => setTimeout(resolve, 500))

        const bestMove = getBestMove(board)
        if (bestMove !== -1) {
            makeMove(bestMove)
        }
        setIsProcessing(false)
    }

    const makeMove = (idx: number) => {
        if (board[idx] !== null || winner || isProcessing) return

        const newBoard = [...board]
        const currentPlayer = isPlayerTurn ? "cat" : "dog"
        newBoard[idx] = getRandomImage(currentPlayer)
        setBoard(newBoard)

        const gameWinner = checkWinner(newBoard)
        if (gameWinner) {
            setWinner(gameWinner)
            setTimeout(() => {
                handleGameEnd(gameWinner)
            }, 500)
            return
        }

        setIsPlayerTurn(!isPlayerTurn)
    }

    const handleGameEnd = (gameWinner: string) => {
        let message = "It's a Draw!"
        if (gameWinner === "cat") {
            message = "You Win! 🎉"
        } else if (gameWinner === "dog") {
            message = "Computer Wins! 🤖"
        }
        alert(message)
        resetGame()
    }

    const handleClick = (idx: number) => {
        if (isPlayerTurn) {
            makeMove(idx)
        }
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setWinner(null)
        setIsPlayerTurn(true)
        setIsProcessing(false)
        setRounds((prev) => prev + 1)

        if (rounds >= 1) {
            router.push("/intro")
        }
    }

    return (
        <div className='text-center py-10'>
            <h1 className='text-3xl font-bold mb-6'>Tic Tac Toe</h1>
            <Board
                board={board}
                handleClick={handleClick}
                disabled={!isPlayerTurn || isProcessing || !!winner}
            />
            <StatusBar
                winner={winner}
                onReset={resetGame}
                isPlayerTurn={isPlayerTurn}
                isProcessing={isProcessing}
            />
        </div>
    )
}

export default TicTacToe
