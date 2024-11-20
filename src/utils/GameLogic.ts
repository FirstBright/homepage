// Types and constants
export type BoardType = (string | null)[]
export type Player = "cat" | "dog" | null

export const WINNING_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const getPlayerFromPath = (path: string | null): Player => {
    if (!path) return null
    return path.includes("/cat/") ? "cat" : "dog"
}

// Modified to work with player types directly
export const checkWinner = (board: BoardType): Player | "draw" => {
    for (let pattern of WINNING_PATTERNS) {
        const [a, b, c] = pattern
        if (board[a] && board[b] && board[c]) {
            const playerA = getPlayerFromPath(board[a])
            const playerB = getPlayerFromPath(board[b])
            const playerC = getPlayerFromPath(board[c])

            if (playerA && playerA === playerB && playerA === playerC) {
                return playerA
            }
        }
    }

    // Check for draw
    if (board.every((cell) => cell !== null)) return "draw"
    return null
}

const minimax = (
    board: BoardType,
    depth: number,
    isMaximizing: boolean,
    alpha: number = -Infinity,
    beta: number = Infinity
): { score: number; move?: number } => {
    const winner = checkWinner(board)

    // Terminal states
    if (winner === "dog") return { score: 10 - depth }
    if (winner === "cat") return { score: depth - 10 }
    if (winner === "draw") return { score: 0 }

    if (isMaximizing) {
        let bestScore = -Infinity
        let bestMove: number | undefined

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = `/dog/${Math.floor(Math.random() * 17)}.png`
                const result = minimax(board, depth + 1, false, alpha, beta)
                board[i] = null

                if (result.score > bestScore) {
                    bestScore = result.score
                    bestMove = i
                }

                alpha = Math.max(alpha, bestScore)
                if (beta <= alpha) break
            }
        }

        return { score: bestScore, move: bestMove }
    } else {
        let bestScore = Infinity
        let bestMove: number | undefined

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                // Try this move
                board[i] = `/cat/${Math.floor(Math.random() * 18)}.png`
                const result = minimax(board, depth + 1, true, alpha, beta)
                board[i] = null

                if (result.score < bestScore) {
                    bestScore = result.score
                    bestMove = i
                }

                beta = Math.min(beta, bestScore)
                if (beta <= alpha) break
            }
        }

        return { score: bestScore, move: bestMove }
    }
}

// New getBestMove function that uses minimax
export const getBestMove = (board: BoardType): number => {
    const result = minimax([...board], 0, true)
    return result.move ?? -1
}

export const getRandomImage = (type: "cat" | "dog"): string => {
    const maxIndex = type === "cat" ? 17 : 16
    const randomIndex = Math.floor(Math.random() * (maxIndex + 1))
    return `/${type}/${randomIndex}.png`
}
