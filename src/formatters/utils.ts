import { ChessColor, GameResultString } from '../types'

export function getResultStringForColor(color?: ChessColor): GameResultString {
    return color === 'white' ? '1-0' : '0-1'
}
