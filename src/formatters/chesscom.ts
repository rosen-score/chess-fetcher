import { parseGame } from '@mliebelt/pgn-parser'
import {
    Game,
    Result,
    ChessColor,
    TimeControl,
    TitledPlayers,
    Title,
    Profile,
    GamePlayer,
    ChessComGame,
    Tournament,
    ChessComTournament,
    TournamentType,
    ChessComGamePlayer,
    ChesscomStats,
    ChessComPlayer,
} from '../types'
import { getResultStringForColor } from './utils'

export function formatTournament(json: ChessComTournament): Tournament {
    const id = json.url.substring(json.url.lastIndexOf('/') + 1)

    let tournamentType: TournamentType = json.settings.type === 'standard' ? 'arena' : 'swiss'

    return {
        id: id,
        type: tournamentType,
        site: 'chess.com',
        url: json.url,
        name: json.name,
        timeControl: getTimeControl(json.settings.time_control),
        isFinished: json.status === 'finished',
        playerCount: json.settings.registered_user_count,
    }
}

export function formatGame(json: ChessComGame, titledPlayers?: TitledPlayers): Game {
    const isStandard: boolean =
        json.rules === 'chess' && json.initial_setup === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    const id = json.url.substring(json.url.lastIndexOf('/') + 1)

    return {
        site: 'chess.com',
        id: id,
        links: {
            white: `https://www.chess.com/analysis/game/live/${id}?tab=analysis&flip=false&move=0`,
            black: `https://www.chess.com/analysis/game/live/${id}?tab=analysis&flip=true&move=0`,
        },

        timestamp: json.end_time * 1000,
        isStandard: isStandard,
        players: {
            white: formatGamePlayer(json.white, titledPlayers),
            black: formatGamePlayer(json.black, titledPlayers),
        },
        timeControl: getTimeControl(json.time_control),

        result: getResult(json),

        // Ignore moves from non-standard games for now
        // When the pgn-parser package tried to parse a Crazyhouse game,
        // it errored when it found the `@` symbol
        moves: isStandard ? getMovesFromPgn(json.pgn) : [],

        opening: {
            name: '',
            eco: '',
        },
    }
}

function getMovesFromPgn(pgn: string) {
    return parseGame(pgn, { startRule: 'game' }).moves
}

export function getResult(json: ChessComGame): Result {
    let colors: ChessColor[] = ['white', 'black']

    for (let color of colors) {
        switch (json[color].result) {
            case 'agreed':
                return {
                    outcome: 'draw',
                    via: 'agreement',
                    label: '½-½',
                }
            case 'insufficient':
            case 'timevsinsufficient':
                return {
                    outcome: 'draw',
                    via: 'insufficient',
                    label: '½-½',
                }
            case 'repetition':
                return {
                    outcome: 'draw',
                    via: 'repetition',
                    label: '½-½',
                }
            case '50move':
                return {
                    outcome: 'draw',
                    via: '50moves',
                    label: '½-½',
                }
            case 'stalemate':
                return {
                    outcome: 'draw',
                    via: 'stalemate',
                    label: '½-½',
                }
            case 'checkmated':
                return {
                    winner: swapColor(color),
                    via: 'checkmate',
                    label: getResultStringForColor(swapColor(color)),
                }
            case 'resigned':
                return {
                    winner: swapColor(color),
                    via: 'resignation',
                    label: getResultStringForColor(swapColor(color)),
                }
            case 'timeout':
                return {
                    winner: swapColor(color),
                    via: 'timeout',
                    label: getResultStringForColor(swapColor(color)),
                }
            case 'abandoned':
                return {
                    winner: swapColor(color),
                    via: 'abandonment',
                    label: getResultStringForColor(swapColor(color)),
                }
            case 'bughousepartnerlose':
            case 'kingofthehill':
            case 'threecheck':
                return {
                    winner: swapColor(color),
                    via: 'variant',
                    label: getResultStringForColor(swapColor(color)),
                }
        }
    }

    throw new Error(`Unexpected result: ${json.white.result} or ${json.black.result}`)
}

export function getTimeControl(time_control: string): TimeControl {
    let values = time_control.split('+').map((value) => +value)

    return {
        initial: values[0],
        increment: values[1] || 0,
    }
}

function swapColor(color: ChessColor): ChessColor {
    return color === 'white' ? 'black' : 'white'
}

function formatGamePlayer(player: ChessComGamePlayer, titledPlayers?: TitledPlayers): GamePlayer {
    let title: Title = null

    if (titledPlayers && titledPlayers[player.username.toLowerCase()]) {
        title = titledPlayers[player.username.toLowerCase()]
    }

    return {
        username: player.username,
        title: title,
    }
}

function sumValuesOfObject(obj: { [key: string]: number }): number {
    return Object.values(obj).reduce((a, b): number => a + b)
}

export function formatProfile(player: ChessComPlayer, ratings: ChesscomStats): Profile {
    return {
        site: 'chess.com',
        link: player.url,
        username: player.username,
        title: player.title || '',

        createdAt: player.joined * 1000,
        lastSeenAt: player.last_online * 1000,
        name: player.name || '',
        location: player.location || '',

        ratings: {
            bullet: {
                rating: ratings.chess_bullet?.last.rating || 0,
                games: ratings.chess_bullet ? sumValuesOfObject(ratings.chess_bullet.record) : 0,
            },
            blitz: {
                rating: ratings.chess_blitz?.last.rating || 0,
                games: ratings.chess_blitz ? sumValuesOfObject(ratings.chess_blitz.record) : 0,
            },
            rapid: {
                rating: ratings.chess_rapid?.last.rating || 0,
                games: ratings.chess_rapid ? sumValuesOfObject(ratings.chess_rapid.record) : 0,
            },
        },
    }
}
