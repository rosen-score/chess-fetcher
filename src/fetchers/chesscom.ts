import { checkForServerError, fetchFromEndpoint } from './fetch'
import { formatGame, formatProfile, formatTournament } from '../formatters/chesscom'
import {
    ChessComArchive,
    ChessComArchives,
    ChessComGame,
    ChesscomGameParameters,
    Profile,
    Title,
    TitledPlayers,
    Tournament,
    ChesscomStats,
    GameCallback,
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

export function playerGames(
    username: string,
    callback: GameCallback,
    params: ChesscomGameParameters = {}
): Promise<boolean> {
    if (params.since && params.since.toString().length !== 13) {
        throw new Error('Invalid timestamp format: Use milliseconds (13-digit timestamp)')
    }

    return new Promise((resolve, reject) => {
        archives(username)
            .then(async (archives) => {
                let allTitledPlayers = await titledPlayers()

                let stopArchiveIteration: boolean = false
                let orderedArchives = archives.archives.reverse()

                for (let archiveUrl of orderedArchives) {
                    if (stopArchiveIteration) return
                    await archive(archiveUrl).then((json) => {
                        let orderedGames: Array<ChessComGame> = json.games.reverse()
                        for (let game of orderedGames) {
                            if (params.since && game.end_time * 1000 < params.since) {
                                stopArchiveIteration = true
                                return
                            }

                            callback(formatGame(game, allTitledPlayers))
                        }
                    })
                }
            })
            .then(() => resolve(true))
            .catch((error) => reject(error))
    })
}

export function tournamentGames(
    id: string,
    callback: GameCallback
): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        let url = `https://api.chess.com/pub/tournament/${id}`

        let allTitledPlayers = await titledPlayers()

        await fetchFromEndpoint(url)
            .then((response) => {
                checkForServerError(response)

                return response.json()
            })
            .then(async (tournament) => {
                let url = tournament.rounds[0]

                if (tournament.settings.type === 'swiss') {
                    url += '/1'
                }

                await fetchFromEndpoint(url)
                    .then((response) => response.json())
                    .then((data: ChessComArchive) => {
                        data.games.forEach((game) => {
                            callback(formatGame(game, allTitledPlayers))
                        })
                    })
            })
            .catch((error) => reject(error))

        resolve(true)
    })
}

export function titledPlayers(
    titles: Array<Title> = ['CM', 'FM', 'GM', 'IM', 'NM', 'WCM', 'WFM', 'WGM', 'WIM', 'WNM']
): Promise<TitledPlayers> {
    return new Promise(async (resolve) => {
        let titledPlayers: TitledPlayers = {}

        for (let title of titles) {
            await fetchFromEndpoint(`https://api.chess.com/pub/titled/${title}`)
                .then((response) => response.json())
                .then((players: { players: string[] }) => {
                    players.players.forEach((player) => (titledPlayers[player.toLowerCase()] = title))
                })
        }

        return resolve(titledPlayers)
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
