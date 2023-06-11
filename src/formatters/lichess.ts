import { parseGame } from '@mliebelt/pgn-parser'
import {
    Game,
    Result,
    TimeControl,
    Profile,
    Tournament,
    LichessArena,
    LichessSwiss,
    LichessPlayer,
    LichessTimeControl,
    LichessGame,
} from '../types'
import { getResultStringForColor } from './utils'

export function formatTournament(json: LichessArena | LichessSwiss): Tournament {
    if ('nbRounds' in json) {
        return {
            id: json.id,
            type: 'swiss',
            site: 'lichess',
            url: `https://lichess.org/swiss/${json.id}`,
            name: json.name,
            timeControl: {
                initial: json.clock.limit,
                increment: json.clock.increment,
            },
            isFinished: json.status === 'finished',
            playerCount: json.nbPlayers,
            stats: {
                games: json.stats.games,
            },
        }
    }

    return {
        id: json.id,
        type: 'arena',
        site: 'lichess',
        url: `https://lichess.org/tournament/${json.id}`,
        name: json.fullName,
        timeControl: {
            initial: json.clock.limit,
            increment: json.clock.increment,
        },
        isFinished: json.isFinished,
        playerCount: json.nbPlayers,
        stats: {
            games: json.stats.games,
        },
    }
}

export function formatGame(json: LichessGame): Game {
    return {
        site: 'lichess',
        type: 'game',
        id: json.id,
        links: {
            white: `https://lichess.org/${json.id}`,
            black: `https://lichess.org/${json.id}/black`,
        },

        timestamp: json.createdAt,
        isStandard: json.variant === 'standard',
        players: {
            white: {
                username: json.players.white.user?.name,
                title: json.players.white.user?.title || null,
                rating: json.players.white.rating,
            },
            black: {
                username: json.players.black.user?.name,
                title: json.players.black.user?.title || null,
                rating: json.players.black.rating,
            },
        },
        timeControl: getTimeControl(json.clock),

        result: getResult(json),
        opening: {
            name: json.opening?.name || '',
            eco: json.opening?.eco || '',
        },
        moves:
            json.variant === 'standard' && json.moves
                ? parseGame(json.pgn || json.moves, { startRule: 'game' }).moves
                : [],
        clocks: json.clocks || [],
        analysis: json.analysis || [],
    }
}

export function getResult(json: Partial<LichessGame>): Result {
    switch (json.status) {
        case 'mate':
            return {
                winner: json.winner,
                via: 'checkmate',
                label: getResultStringForColor(json.winner),
            }
        case 'resign':
            return {
                winner: json.winner,
                via: 'resignation',
                label: getResultStringForColor(json.winner),
            }
        case 'outoftime':
            return {
                winner: json.winner,
                via: 'timeout',
                label: getResultStringForColor(json.winner),
            }
        case 'timeout':
            return {
                winner: json.winner,
                via: 'abandonment',
                label: getResultStringForColor(json.winner),
            }
        case 'noStart':
            return {
                winner: json.winner,
                via: 'noStart',
                label: getResultStringForColor(json.winner),
            }
        case 'variantEnd':
            return {
                winner: json.winner,
                via: 'variant',
                label: getResultStringForColor(json.winner),
            }
        case 'cheat':
            return {
                winner: json.winner,
                via: 'cheat',
                label: getResultStringForColor(json.winner),
            }
        case 'draw':
            return {
                outcome: 'draw',
                label: '½-½',
            }
        case 'stalemate':
            return {
                outcome: 'draw',
                via: 'stalemate',
                label: '½-½',
            }
    }

    throw new Error(`Unexpected result: ${json.status}`)
}

function getTimeControl(time_control: LichessTimeControl): TimeControl {
    if (!time_control) {
        return {
            initial: 0,
            increment: 0,
        }
    }

    return {
        initial: time_control.initial,
        increment: time_control.increment,
    }
}

export function formatProfile(player: LichessPlayer): Profile {
    if (player.disabled) {
        return {
            site: 'lichess',
            type: 'profile',
            username: player.username,
            link: `https://lichess.org/@/${player.username}`,
            disabled: true,
        }
    }

    let name = [player.profile?.firstName, player.profile?.lastName].join(' ').trim()

    return {
        site: 'lichess',
        type: 'profile',
        link: player.url,
        username: player.username,
        title: player.title || '',

        createdAt: player.createdAt,
        lastSeenAt: player.seenAt,
        name: name,
        location: player.profile?.location || '',

        ratings: {
            bullet: {
                rating: player.perfs.bullet.rating,
                games: player.perfs.bullet.games,
            },
            blitz: {
                rating: player.perfs.blitz.rating,
                games: player.perfs.blitz.games,
            },
            rapid: {
                rating: player.perfs.rapid.rating,
                games: player.perfs.rapid.games,
            },
        },

        counts: player.count?.all
            ? {
                  all: player.count.all,
              }
            : {},

        marked: player.tosViolation || false,
    }
}
