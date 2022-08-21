import ndjson from 'fetch-ndjson'
import { formatGame, formatProfile, formatTournament } from '../formatters/lichess'
import { checkForServerError, fetchFromEndpoint } from './fetch'
import { Game, GameCallback, LichessGameParameters, Profile, Tournament } from '../types'

export function qs(obj: Record<string, any>): string {
    let params = new URLSearchParams(obj).toString()
    return params ? '?' + params : ''
}

export function profile(username: string): Promise<Profile> {
    return fetchFromEndpoint(`https://lichess.org/api/user/${username}`).then((response) => {
        checkForServerError(response)

        return new Promise((resolve) => {
            response.json().then((data) => resolve(formatProfile(data)))
        })
    })
}

export function arena(id: string) {
    return tournament(`https://lichess.org/api/tournament/${id}`)
}

export function swiss(id: string) {
    return tournament(`https://lichess.org/api/swiss/${id}`)
}

function tournament(url: string): Promise<Tournament> {
    return fetchFromEndpoint(url).then((response) => {
        checkForServerError(response)

        return new Promise((resolve) => {
            response.json().then((data) => resolve(formatTournament(data)))
        })
    })
}

export function playerGames(username: string, callback: GameCallback, params: LichessGameParameters = {}) {
    return games(`https://lichess.org/api/games/user/${username}`, callback, params)
}

export function arenaGames(id: string, callback: GameCallback, params: LichessGameParameters = {}) {
    return games(`https://lichess.org/api/tournament/${id}/games`, callback, params)
}

export function swissGames(id: string, callback: GameCallback, params: LichessGameParameters = {}) {
    return games(`https://lichess.org/api/swiss/${id}/games`, callback, params)
}

export async function games(url: string, callback: GameCallback, params: LichessGameParameters = {}): Promise<boolean> {
    let response = await fetchFromEndpoint(url + qs(params), {
        headers: {
            Accept: 'application/x-ndjson',
        },
    })

    checkForServerError(response)

    return new Promise(async (resolve) => {
        let reader = response.body!.getReader()
        let gen = ndjson(reader)

        while (true) {
            let { done, value } = await gen.next()

            if (done) {
                resolve(true)
                return
            }

            callback(formatGame(value))
        }
    })
}

export function game(url: string): Promise<Game> {
    let gameId = new URL(url).pathname.split('/')[1]

    if (gameId.length === 12) {
        gameId = gameId.substring(0, 8)
    }

    if (gameId.length !== 8) {
        throw new Error(`Invalid game ID: ${gameId}`)
    }

    return fetchFromEndpoint(`https://lichess.org/game/export/${gameId}${qs({ pgnInJson: true, clocks: true })}`).then(
        (response) => {
            checkForServerError(response)

            return new Promise((resolve) => {
                response.json().then((data) => resolve(formatGame(data)))
            })
        }
    )
}
