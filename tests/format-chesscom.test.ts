import { describe, expect, test } from 'vitest'
import { formatGame, formatProfile, getResult, getTimeControl } from '../src/formatters/chesscom'
import { readFileSync } from 'fs'
import { ChessComGame, Result } from '../src/types'
import { PartialDeep } from 'type-fest'

test('format chesscom game', () => {
    let games = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/05.json', 'utf-8'))
    let game = games.games[0]

    let formattedGame = formatGame(game)
    let formattedGameMinusMoves = Object.assign({}, formattedGame, {
        moves: [],
    })

    expect(formattedGameMinusMoves).toEqual({
        site: 'chess.com',
        id: '45328864849',
        links: {
            white: `https://www.chess.com/analysis/game/live/45328864849?tab=analysis&flip=false&move=0`,
            black: `https://www.chess.com/analysis/game/live/45328864849?tab=analysis&flip=true&move=0`,
        },

        timestamp: 1651590494000,
        isStandard: true,

        result: {
            winner: 'black',
            via: 'checkmate',
            label: '0-1',
        },

        moves: [],
        players: {
            white: {
                username: 'IMRosen',
                title: null,
            },
            black: {
                username: 'elchacal664',
                title: null,
            },
        },
        timeControl: {
            initial: 180,
            increment: 1,
        },
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('d4')
})

test('format chesscom game w/ titled players', () => {
    let games = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/05.json', 'utf-8'))
    let game = games.games[0]

    let formattedGame = formatGame(game, {
        imrosen: 'IM',
        elchacal664: 'NM',
    })

    expect(formattedGame.players).toEqual({
        white: {
            username: 'IMRosen',
            title: 'IM',
        },
        black: {
            username: 'elchacal664',
            title: 'NM',
        },
    })
})

test('format chess.com player', () => {
    let player = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/player.json', 'utf-8'))
    let stats = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/stats.json', 'utf-8'))

    expect(formatProfile(player, stats)).toStrictEqual({
        site: 'chess.com',
        username: 'imrosen',
        title: 'IM',
        createdAt: 1327467686000,
        lastSeenAt: 1654340204000,
        link: 'https://www.chess.com/member/IMRosen',
        location: 'St. Louis',
        name: 'Eric Rosen',

        ratings: {
            bullet: {
                rating: 2825,
                games: 8060,
            },
            blitz: {
                rating: 2701,
                games: 2323,
            },
            rapid: {
                rating: 2312,
                games: 51,
            },
        },
    })
})

test('format chess.com player with no games', () => {
    let player = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/player-without-profile.json', 'utf-8'))
    let stats = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/stats-empty.json', 'utf-8'))

    expect(formatProfile(player, stats)).toStrictEqual({
        site: 'chess.com',
        username: 'blank-user',
        title: '',
        createdAt: 1655594965000,
        lastSeenAt: 1655594965000,
        link: 'https://www.chess.com/member/blank-user',
        location: '',
        name: '',

        ratings: {
            bullet: {
                rating: 0,
                games: 0,
            },
            blitz: {
                rating: 0,
                games: 0,
            },
            rapid: {
                rating: 0,
                games: 0,
            },
        },
    })
})

describe('results', () => {
    test.each<[PartialDeep<ChessComGame>, Result]>([
        // draws
        [
            { white: { result: 'agreed' }, black: { result: 'agreed' } },
            { outcome: 'draw', via: 'agreement', label: '½-½' },
        ],
        [
            {
                white: { result: 'insufficient' },
                black: { result: 'insufficient' },
            },
            { outcome: 'draw', via: 'insufficient', label: '½-½' },
        ],
        [
            {
                white: { result: 'repetition' },
                black: { result: 'repetition' },
            },
            { outcome: 'draw', via: 'repetition', label: '½-½' },
        ],
        [
            {
                white: { result: '50move' },
                black: { result: '50move' },
            },
            { outcome: 'draw', via: '50moves', label: '½-½' },
        ],
        [
            {
                white: { result: 'timevsinsufficient' },
                black: { result: 'timevsinsufficient' },
            },
            { outcome: 'draw', via: 'insufficient', label: '½-½' },
        ],
        [
            { white: { result: 'stalemate' }, black: { result: 'stalemate' } },
            { outcome: 'draw', via: 'stalemate', label: '½-½' },
        ],
        // wins/losses
        [
            { white: { result: 'win' }, black: { result: 'checkmated' } },
            { winner: 'white', via: 'checkmate', label: '1-0' },
        ],
        [
            { white: { result: 'checkmated' }, black: { result: 'win' } },
            { winner: 'black', via: 'checkmate', label: '0-1' },
        ],
        [
            { white: { result: 'resigned' }, black: { result: 'win' } },
            { winner: 'black', via: 'resignation', label: '0-1' },
        ],
        [
            { white: { result: 'timeout' }, black: { result: 'win' } },
            { winner: 'black', via: 'timeout', label: '0-1' },
        ],
        [
            { white: { result: 'abandoned' }, black: { result: 'win' } },
            { winner: 'black', via: 'abandonment', label: '0-1' },
        ],
        [
            { white: { result: 'win' }, black: { result: 'abandoned' } },
            { winner: 'white', via: 'abandonment', label: '1-0' },
        ],
        // variants
        [
            { white: { result: 'threecheck' }, black: { result: 'win' } },
            { winner: 'black', via: 'variant', label: '0-1' },
        ],
        [
            { white: { result: 'win' }, black: { result: 'threecheck' } },
            { winner: 'white', via: 'variant', label: '1-0' },
        ],
        [
            { white: { result: 'win' }, black: { result: 'bughousepartnerlose' } },
            { winner: 'white', via: 'variant', label: '1-0' },
        ],
        [
            { white: { result: 'win' }, black: { result: 'kingofthehill' } },
            { winner: 'white', via: 'variant', label: '1-0' },
        ],
    ])('test results', (input, expected) => {
        expect(getResult(input)).toStrictEqual(expected)
    })
})

describe('test invalid result', () => {
    test.each<PartialDeep<ChessComGame>>([
        { white: { result: 'invalidresult' }, black: { result: 'win' } },
        { white: { result: 'win' }, black: { result: 'invalidresult' } },
    ])('test results', async (input) => {
        await expect(() => getResult(input)).toThrowError(/Unexpected result/)
    })
})

describe('time controls', () => {
    test.each([
        ['600+5', { initial: 600, increment: 5 }],
        ['600', { initial: 600, increment: 0 }],
    ])('test time controls', (input, expected) => {
        expect(getTimeControl(input)).toStrictEqual(expected)
    })
})
