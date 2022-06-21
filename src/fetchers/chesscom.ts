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
    Game,
    ChesscomStats,
    GameCallback,
} from '../types'

export function profile(username: string): Promise<Profile> {
    return fetchFromEndpoint(`https://api.chess.com/pub/player/${username}`).then(async function (response) {
        checkForServerError(response)

        let ratings = await stats(username)

        return new Promise((resolve, reject) => {
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
    params: ChesscomGameParameters = {},
    titledPlayers: TitledPlayers = {}
): Promise<boolean> {
    if (params.since && params.since.toString().length !== 13) {
        throw new Error('Invalid timestamp format: Use milliseconds (13-digit timestamp)')
    }

    return new Promise((resolve, reject) => {
        archives(username)
            .then(async (archives) => {
                let stopArchiveIteration: boolean = false
                let orderedArchives = archives.archives.reverse()

                for (let archiveUrl of orderedArchives) {
                    if (stopArchiveIteration) return
                    await archive(archiveUrl).then(function (json) {
                        let orderedGames: Array<ChessComGame> = json.games.reverse()
                        for (let game of orderedGames) {
                            if (params.since && game.end_time * 1000 < params.since) {
                                stopArchiveIteration = true
                                return
                            }

                            callback(formatGame(game, titledPlayers))
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
    callback: GameCallback,
    params: ChesscomGameParameters = {},
    titledPlayers: TitledPlayers = {}
): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        let url = `https://api.chess.com/pub/tournament/${id}`

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
                            callback(formatGame(game, titledPlayers))
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
    return new Promise(async (resolve, reject) => {
        let titledPlayers: TitledPlayers = {}

        for (let title of titles) {
            await fetchFromEndpoint(`https://api.chess.com/pub/titled/${title}`)
                .then((response) => response.json())
                .then(function (players: { players: string[] }) {
                    players.players.forEach((player) => (titledPlayers[player] = title))
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
    return fetchFromEndpoint(url).then(function (response) {
        checkForServerError(response)

        return new Promise((resolve, reject) => {
            response.json().then((data) => resolve(formatTournament(data)))
        })
    })
}
