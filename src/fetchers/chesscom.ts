import { checkForServerError, fetchFromEndpoint } from './fetch'
import { formatGame, formatProfile, formatTournament } from '../formatters/chesscom'
import {
    ChessComArchive,
    ChessComArchives,
    ChesscomGameParameters,
    Profile,
    Title,
    TitledPlayers,
    Tournament,
    ChesscomStats,
    GameCallback,
    Game,
} from '../types'

export function profile(username: string): Promise<Profile> {
    return fetchFromEndpoint(`https://api.chess.com/pub/player/${username}`).then(async (response) => {
        checkForServerError(response)

        let ratings = await stats(username)

        return new Promise((resolve) => {
            response.json().then((data) => resolve(formatProfile(data, ratings)))
        })
    })
}

export function archives(username: string): Promise<ChessComArchives> {
    return fetchFromEndpoint(`https://api.chess.com/pub/player/${username}/games/archives`).then((response) => {
        checkForServerError(response)
        return response.json()
    })
}

export function archive(archiveUrl: string): Promise<ChessComArchive> {
    return fetchFromEndpoint(archiveUrl).then((response) => {
        checkForServerError(response)
        return response.json()
    })
}

export function playerGamesForMonth(
    username: string,
    year: number,
    month: number,
    callback: GameCallback
): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        let month2digit: string = ('0' + month.toString()).slice(-2)
        await archive(`https://api.chess.com/pub/player/${username}/games/${year}/${month2digit}`)
            .then((json) => {
                for (let game of json.games) {
                    callback(formatGame(game))
                }
            })
            .then(() => resolve(true))
            .catch((error) => reject(error))
    })
}

export function playerGames(
    username: string,
    callback: GameCallback,
    params: ChesscomGameParameters = {}
): Promise<boolean> {
    if (params.since && params.since.toString().length !== 13) {
        throw new Error('Invalid timestamp format: Use 13-digit timestamp (w/ milliseconds)')
    }

    return new Promise((resolve, reject) => {
        archives(username)
            .then(async (data) => {
                let allTitledPlayers = await titledPlayers()

                let stopArchiveIteration: boolean = false
                let gameCounter: number = 0
                data.archives.reverse()

                for (let archiveUrl of data.archives) {
                    if (stopArchiveIteration) return
                    await archive(archiveUrl).then((json) => {
                        json.games.reverse()
                        for (let game of json.games) {
                            if (params.since && game.end_time * 1000 < params.since) {
                                stopArchiveIteration = true
                                return
                            }

                            if (params.max && gameCounter >= params.max) {
                                stopArchiveIteration = true
                                return
                            }

                            gameCounter++

                            callback(formatGame(game, allTitledPlayers))
                        }
                    })
                }
            })
            .then(() => resolve(true))
            .catch((error) => reject(error))
    })
}

export function tournamentGames(id: string, callback: GameCallback): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        let allTitledPlayers = await titledPlayers()

        await fetchFromEndpoint(`https://api.chess.com/pub/tournament/${id}`)
            .then((response) => {
                checkForServerError(response)
                return response.json()
            })
            .then(async (data) => {
                let url = data.rounds[0]

                if (data.settings.type === 'swiss') {
                    url += '/1'
                }

                await fetchFromEndpoint(url)
                    .then((response) => response.json())
                    .then((gameArchive: ChessComArchive) => {
                        gameArchive.games.forEach((game) => {
                            callback(formatGame(game, allTitledPlayers))
                        })
                    })
            })
            .catch((error) => reject(error))

        resolve(true)
    })
}

export function game(url: string): Promise<Game> {
    let gameId = new URL(url).pathname.split('/')[3]
    return fetchFromEndpoint(`https://www.chess.com/callback/live/game/${gameId}`).then((response) => {
        return new Promise((resolve, reject) => {
            response.json().then((data) => {
                let uuid = data.game.uuid
                let date = data.game.pgnHeaders.Date.split('.')

                archive(
                    `https://api.chess.com/pub/player/${data.game.pgnHeaders.White.toLowerCase()}/games/${date[0]}/${
                        date[1]
                    }`
                ).then((data) => {
                    for (let game of data.games) {
                        if (game.uuid === uuid) {
                            resolve(formatGame(game))
                            return
                        }

                        reject(new Error('Game not found in monthly archive'))
                    }
                })
            })
        })
    })
}

// Chess.com doesn't provide a way to determine if an opponent is a bot
// These are some of the common ones I found
function botAccounts(): string[] {
    return ['stockfish', 'computer4-impossible', ...Array.from({ length: 25 }, (_, i) => `komodo${i + 1}`)]
}

export function titledPlayers(
    titles: Array<Title> = ['CM', 'FM', 'GM', 'IM', 'NM', 'WCM', 'WFM', 'WGM', 'WIM', 'WNM', 'BOT']
): Promise<TitledPlayers> {
    return new Promise(async (resolve) => {
        let allTitledPlayers: TitledPlayers = {}

        for (let title of titles) {
            if (title === 'BOT') continue
            await fetchFromEndpoint(`https://api.chess.com/pub/titled/${title}`)
                .then((response) => response.json())
                .then((players: { players: string[] }) => {
                    players.players.forEach((player) => (allTitledPlayers[player.toLowerCase()] = title))
                })
        }

        if (titles.includes('BOT')) {
            for (let bot of botAccounts()) {
                allTitledPlayers[bot] = 'BOT'
            }
        }

        return resolve(allTitledPlayers)
    })
}

export function stats(username: string): Promise<ChesscomStats> {
    return fetchFromEndpoint(`https://api.chess.com/pub/player/${username}/stats`).then((response) => {
        checkForServerError(response)
        return response.json()
    })
}

export function tournament(id: string): Promise<Tournament> {
    let url = `https://api.chess.com/pub/tournament/${id}`
    return fetchFromEndpoint(url).then((response) => {
        checkForServerError(response)

        return new Promise((resolve) => {
            response.json().then((data) => resolve(formatTournament(data)))
        })
    })
}
