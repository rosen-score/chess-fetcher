import { FetchOptions } from '../types'

const abortController = new AbortController()

let lichessOauthToken: string | null

/**
 * Add an OAuth token for Lichess requests.
 * Allows faster download rates when requesting games.
 *
 * @param token OAuth token
 * @returns void
 */
export function addLichessOauthToken(token: string) {
    lichessOauthToken = token
}

/**
 * Remove the OAuth token for Lichess requests.
 *
 * @returns void
 */
export function resetOauthToken() {
    lichessOauthToken = null
}

export function cancelFetch(): void {
    abortController.abort()
}

export function fetchFromEndpoint(url: string, options: FetchOptions = {}) {
    if (lichessOauthToken && url.startsWith('https://lichess.org/')) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${lichessOauthToken}`,
        }
    }

    options = {
        signal: abortController.signal,
        headers: {
            Accept: 'application/json',
        },
        ...options,
    }

    /* istanbul ignore else -- @preserve */
    if (process.env.NODE_ENV === 'test') {
        url = getMockServerEndpoint(url)
    }

    return fetch(url, options)
}

export function checkForServerError(response: Response) {
    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
    }
}

function getMockServerEndpoint(url: string): string {
    let rewrites: { [key: string]: string } = {
        // Lichess
        'https://lichess.org/debug-headers': '/headers',

        'https://lichess.org/api/user/EricRosen': '/lichess/player.json',
        'https://lichess.org/api/user/blank-user': '/lichess/player-without-profile.json',

        'https://lichess.org/game/export/KSMY85yj?pgnInJson=true&clocks=true': '/lichess/game.json',

        'https://lichess.org/api/tournament/2oEh6hZw': '/lichess/arena.json',
        'https://lichess.org/api/swiss/48jrx3m6': '/lichess/swiss.json',

        'https://lichess.org/api/games/user/EricRosen': '/ndjson/lichess/games',
        'https://lichess.org/api/tournament/2oEh6hZw/games': '/ndjson/lichess/games',
        'https://lichess.org/api/swiss/48jrx3m6/games': '/ndjson/lichess/games',

        'https://lichess.org/api/games/user/EricRosen?since=16557255145620': '/ndjson/lichess/games-with-since-filter',
        'https://lichess.org/api/games/user/user-with-no-games': '/ndjson/lichess/games-empty',

        'https://lichess.org/api/user/user404': '/status/404',
        'https://lichess.org/api/tournament/tournament404': '/status/404',
        'https://lichess.org/api/swiss/tournament404': '/status/404',
        'https://lichess.org/api/games/user/user404': '/status/404',
        'https://lichess.org/api/swiss/tournament404/games': '/status/404',
        'https://lichess.org/api/tournament/tournament404/games': '/status/404',

        'https://lichess.org/api/user/user429': '/status/429',
        'https://lichess.org/api/tournament/tournament429': '/status/429',
        'https://lichess.org/api/swiss/tournament429': '/status/429',
        'https://lichess.org/api/games/user/user429': '/status/429',
        'https://lichess.org/api/swiss/tournament429/games': '/status/429',
        'https://lichess.org/api/tournament/tournament429/games': '/status/429',

        'https://lichess.org/api/games/user/longRequest': '/long-response/1',

        // Chess.com
        'https://api.chess.com/debug-headers': '/headers',
        'https://api.chess.com/pub/player/imrosen': '/chesscom/player.json',
        'https://api.chess.com/pub/player/imrosen/stats': '/chesscom/stats.json',
        'https://api.chess.com/pub/player/imrosen/games/archives': '/chesscom/archives.json',
        'https://api.chess.com/pub/player/imrosen/games/2022/03': '/chesscom/03.json',
        'https://api.chess.com/pub/player/imrosen/games/2022/04': '/chesscom/04.json',
        'https://api.chess.com/pub/player/imrosen/games/2022/05': '/chesscom/05.json',
        'https://api.chess.com/pub/titled/CM': '/chesscom/titled/CM.json',
        'https://api.chess.com/pub/titled/FM': '/chesscom/titled/FM.json',
        'https://api.chess.com/pub/titled/GM': '/chesscom/titled/GM.json',
        'https://api.chess.com/pub/titled/IM': '/chesscom/titled/IM.json',
        'https://api.chess.com/pub/titled/NM': '/chesscom/titled/NM.json',
        'https://api.chess.com/pub/titled/WCM': '/chesscom/titled/WCM.json',
        'https://api.chess.com/pub/titled/WFM': '/chesscom/titled/WFM.json',
        'https://api.chess.com/pub/titled/WGM': '/chesscom/titled/WGM.json',
        'https://api.chess.com/pub/titled/WIM': '/chesscom/titled/WIM.json',
        'https://api.chess.com/pub/titled/WNM': '/chesscom/titled/WNM.json',

        'https://www.chess.com/callback/live/game/45328864849': '/chesscom/game-45328864849.json',
        'https://www.chess.com/callback/live/game/45331170609': '/chesscom/game-45331170609.json',
        'https://www.chess.com/callback/live/game/999': '/chesscom/game-missing-from-archive.json',

        'https://api.chess.com/pub/tournament/late-titled-tuesday-blitz-june-07-2022-3192103': '/chesscom/swiss.json',
        'https://api.chess.com/pub/tournament/10-bullet-1925132': '/chesscom/arena.json',

        'https://api.chess.com/pub/tournament/late-titled-tuesday-blitz-june-07-2022-3192103/11/1':
            '/chesscom/tournament-games.json',
        'https://api.chess.com/pub/tournament/10-bullet-1925132/1': '/chesscom/tournament-games.json',

        'https://api.chess.com/pub/player/user404': '/status/404',
        'https://api.chess.com/pub/player/user404/stats': '/status/404',
        'https://api.chess.com/pub/player/user404/games/archives': '/status/404',
        'https://api.chess.com/pub/player/user404/games/2022/05': '/status/404',
        'https://api.chess.com/pub/tournament/tournament404': '/status/404',

        'https://api.chess.com/pub/player/user429': '/status/429',
        'https://api.chess.com/pub/player/user429/stats': '/status/429',
        'https://api.chess.com/pub/tournament/tournament429': '/status/429',
        'https://api.chess.com/pub/player/user429/games/archives': '/status/429',
        'https://api.chess.com/pub/player/user429/games/2022/05': '/status/429',
    }

    if (!rewrites[url]) {
        throw new Error(`Missing mocked endpoint: ${url}`)
    }

    return process.env.MockServerAddress + rewrites[url]
}
