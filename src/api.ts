import {
    profile as lichessProfile,
    game as lichessGame,
    arena as lichessArena,
    swiss as lichessSwiss,
    playerGames as lichessPlayerGames,
    arenaGames as lichessArenaGames,
    swissGames as lichessSwissGames,
} from './fetchers/lichess'
import {
    profile as chesscomProfile,
    game as chesscomGame,
    tournament as chesscomTournament,
    playerGames as chesscomPlayerGames,
    tournamentGames as chesscomTournamentGames,
} from './fetchers/chesscom'
import { ChesscomGameParameters, Game, GameCallback, LichessGameParameters, Profile, Tournament } from './types'
import { addOauthTokenForLichessRequests } from './fetchers/fetch'

/**
 * Fetch a player's profile (public info, rating, game stats)
 *
 * @param url URL of player profile (ex: https://lichess.org/@/DrNykterstein or https://chess.com/member/magnuscarlsen)
 * @returns Promise of player profile
 * @throws Error if the URL is invalid
 */
export function player(url: string): Promise<Profile> {
    const username = url.substring(url.lastIndexOf('/') + 1)

    if (url.startsWith('https://lichess.org/@/')) {
        return lichessProfile(username)
    } else if (url.startsWith('https://www.chess.com/member/')) {
        return chesscomProfile(username)
    }

    throw new Error('Must specify the URL to a Lichess or Chess.com player profile')
}

/**
 * Fetch tournament info/stats
 *
 * @param url URL of tournament. Can be (1) Lichess arena, (2) Lichess Swiss, (3) Chess.com arena, or (4) Chess.com Swiss
 * @returns Promise of tournament info
 * @throws Error if the URL is invalid
 */
export function tournament(url: string): Promise<Tournament> {
    const id = url.substring(url.lastIndexOf('/') + 1)

    if (url.startsWith('https://lichess.org/tournament/')) {
        return lichessArena(id)
    } else if (url.startsWith('https://lichess.org/swiss/')) {
        return lichessSwiss(id)
    } else if (url.startsWith('https://www.chess.com/tournament/')) {
        return chesscomTournament(id)
    }

    throw new Error('Invalid tournament URL')
}

/**
 * Fetch games of a player or tournament
 *
 * @param url URL of what you want the games for. Can be (1) Lichess player, (2) Chess.com player, (3) Lichess tournament (arena or Swiss), or (4) Chess.com tournament (arena or Swiss)
 * @param callback Function to call for each game. The function will be passed a game object.
 * @param params Optional parameters to pass to the API.
 * @returns Promise when all games are fetched
 * @throws Error if the URL is invalid
 */
export function games(
    url: string,
    callback: GameCallback,
    params: LichessGameParameters | ChesscomGameParameters = {}
): Promise<boolean> {
    const id = url.substring(url.lastIndexOf('/') + 1)

    if (url.startsWith('https://lichess.org/@/')) {
        return lichessPlayerGames(id, callback, params)
    } else if (url.startsWith('https://www.chess.com/member/')) {
        return chesscomPlayerGames(id, callback, params)
    } else if (url.startsWith('https://lichess.org/tournament/')) {
        return lichessArenaGames(id, callback, params)
    } else if (url.startsWith('https://lichess.org/swiss/')) {
        return lichessSwissGames(id, callback, params)
    } else if (url.startsWith('https://www.chess.com/tournament/')) {
        return chesscomTournamentGames(id, callback)
    }

    throw new Error('Must specify the URL to a Lichess or Chess.com player profile or tournament')
}

/**
 * Fetch an individual game
 *
 * @param url URL of game from Lichess or Chess.com
 * @returns Promise of game info
 * @throws Error if the URL is invalid
 */
export function game(url: string): Promise<Game> {
    if (url.startsWith('https://lichess.org/')) {
        return lichessGame(url)
    } else if (url.startsWith('https://www.chess.com/')) {
        return chesscomGame(url)
    }

    throw new Error('Must specify the URL to a Lichess or Chess.com game')
}

/**
 * Add an OAuth token for Lichess requests.
 * Allows faster download rates when requesting games.
 *
 * @param token OAuth token
 * @returns void
 */
export function addLichessOauthToken(token: string): void {
    addOauthTokenForLichessRequests(token)
}
