import React from "react"
import Cell from "./Cell"
import { BoardType } from "../utils/GameLogic"

interface BoardProps {
    board: BoardType
    handleClick: (idx: number) => void
    disabled?: boolean
}

const Board: React.FC<BoardProps> = ({
    board,
    handleClick,
    disabled = false,
}) => {
    return (
        <div className='grid grid-cols-3 gap-2 w-72 mx-auto'>
            {board.map((cell, idx) => (
                <Cell
                    key={idx}
                    value={cell}
                    onClick={() => handleClick(idx)}
                    disabled={disabled || cell !== null}
                />
            ))}
        </div>
    )
}

export default Board
