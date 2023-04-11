import { describe, expect, test } from 'vitest'
import { formatGame, formatProfile, getResult, getTimeControl } from '../src/formatters/chesscom'
import { readFileSync } from 'fs'
import { ChessComGame, Result } from '../src/types'

test('format chesscom game', () => {
    let games = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/05.json', 'utf-8'))
    let game = games.games[0]

    let formattedGame = formatGame(game)
    let formattedGameMinusMoves = Object.assign({}, formattedGame, {
        moves: [],
    })

    expect(formattedGameMinusMoves).toEqual({
        site: 'chess.com',
        type: 'game',
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
        clocks: [
            18090, 17870, 18150, 17480, 18120, 16920, 18110, 16960, 18100, 15400, 18030, 14650, 17780, 14600, 17770,
            14220, 17860, 14070, 17870, 13870, 17840, 13620, 17830, 13590, 17770, 13170, 17780, 12850, 17400, 12650,
            16190, 12490, 14690, 10010, 14520, 9780, 13520, 9760, 13210, 8880, 13190, 8920, 12610, 8690, 12440, 8290,
            11470, 8130, 8290, 7170, 8380, 6280, 8390, 6000, 8380, 5110, 7280, 5000, 5240, 4320, 5330, 4230, 5130, 3890,
            5020, 3760, 3210, 3540, 3260, 3510, 3040, 3390, 3030, 2850, 2950, 2850, 2640, 2790, 2660, 2650, 2680, 2640,
            2570, 2550, 2480, 2310, 1710, 2130, 1630, 2110, 1480, 1950, 1480, 1850, 1240, 1750, 1240, 1700, 1290, 1700,
            1270, 1790, 1300, 1750, 1040, 1720, 670, 1720, 660, 1750, 420, 1700, 420, 1500, 470, 1360, 130, 1300, 200,
            1240,
        ],
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
        opening: {
            eco: '',
            name: '',
        },
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('d4')
})

test('format chesscom arena game', () => {
    let game = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/arena-game.json', 'utf-8'))

    let formattedGame = formatGame(game)
    let formattedGameMinusMoves = Object.assign({}, formattedGame, {
        moves: [],
    })

    expect(formattedGameMinusMoves).toEqual({
        site: 'chess.com',
        type: 'game',
        id: '68667858629',
        links: {
            white: 'https://www.chess.com/analysis/game/live/68667858629?tab=analysis&flip=false&move=0',
            black: 'https://www.chess.com/analysis/game/live/68667858629?tab=analysis&flip=true&move=0',
        },

        timestamp: 1674928926000,
        isStandard: true,

        result: {
            winner: 'black',
            via: 'timeout',
            label: '0-1',
        },

        moves: [],
        clocks: [
            5900, 5990, 5850, 5920, 5840, 5900, 5800, 5830, 5780, 5820, 5700, 5810, 5660, 5750, 5630, 5620, 5560, 5590,
            5490, 5550, 5460, 5510, 5440, 5330, 5310, 5320, 5130, 5110, 5060, 5000, 4990, 4820, 4870, 4810, 4750, 4750,
            4450, 4620, 4010, 4490, 3980, 4380, 3650, 4280, 3530, 4190, 3480, 4160, 3290, 4050, 3190, 3890, 3110, 2920,
            2760, 2740, 2370, 2660, 2050, 2460, 1950, 2270, 1920, 2100, 1830, 2090, 1810, 1600, 1760, 1520, 1640, 1300,
            1630, 1260, 1540, 1180, 1350, 1060, 1070, 890, 1060, 850, 1040, 750, 1030, 740, 940, 730, 920, 720, 860,
            680, 790, 610, 780, 550, 680, 470, 630, 460, 600, 390, 590, 380, 540, 370, 470, 360, 400, 350, 370, 340,
            280, 330, 270, 320, 150, 310, 70, 270, 60, 180, 50, 170, 40, 140,
        ],
        players: {
            white: {
                username: 'Hikaru',
                title: null,
            },
            black: {
                username: 'Oleksandr_Bortnyk',
                title: null,
            },
        },
        timeControl: {
            initial: 60,
            increment: 0,
        },
        opening: {
            eco: '',
            name: '',
        },
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('e3')
})

test('format chesscom 960 game', () => {
    let game = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/game-960.json', 'utf-8'))
    let formattedGame = formatGame(game)

    expect(formattedGame.moves).toStrictEqual([])
})

test('format chesscom game (daily game)', () => {
    let game = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/game-daily.json', 'utf-8'))

    let formattedGame = formatGame(game)
    let formattedGameMinusMoves = Object.assign({}, formattedGame, {
        moves: [],
    })

    expect(formattedGameMinusMoves).toEqual({
        site: 'chess.com',
        type: 'game',
        id: '122454262',
        links: {
            white: `https://www.chess.com/analysis/game/daily/122454262?tab=analysis&flip=false&move=0`,
            black: `https://www.chess.com/analysis/game/daily/122454262?tab=analysis&flip=true&move=0`,
        },

        timestamp: 1447870004000,
        isStandard: true,

        result: {
            winner: 'white',
            via: 'checkmate',
            label: '1-0',
        },

        moves: [],
        clocks: [],
        players: {
            white: {
                username: 'R_Doofus',
                title: null,
            },
            black: {
                username: '50BigDave50',
                title: null,
            },
        },
        timeControl: {
            correspondence: 432000,
        },
        opening: {
            eco: '',
            name: '',
        },
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('e4')
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
        type: 'profile',
        username: 'IMRosen',
        title: 'IM',
        createdAt: 1327467686000,
        lastSeenAt: 1654340204000,
        link: 'https://www.chess.com/member/IMRosen',
        location: 'St. Louis',
        name: 'Eric Rosen',

        ratings: {
            bullet: {
                rating: 2743,
                games: 8546,
            },
            blitz: {
                rating: 2614,
                games: 2897,
            },
            rapid: {
                rating: 2389,
                games: 103,
            },
        },

        counts: {
            all: 11548,
        },
    })
})

test('format chess.com player with no games', () => {
    let player = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/player-without-profile.json', 'utf-8'))
    let stats = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/stats-empty.json', 'utf-8'))

    expect(formatProfile(player, stats)).toStrictEqual({
        site: 'chess.com',
        type: 'profile',
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

        counts: {
            all: 0,
        },
    })
})

describe('results', () => {
    test.each<[object, Result]>([
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
        let games = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/05.json', 'utf-8'))
        let game: ChessComGame = {
            ...games.games[0],
            ...input,
        }
        expect(getResult(game)).toStrictEqual(expected)
    })
})

describe('test invalid result', () => {
    test.each<[object, string]>([
        [{ white: { result: 'invalidresult' }, black: { result: 'win' } }, 'Unexpected result: invalidresult or win'],
        [{ white: { result: 'win' }, black: { result: 'invalidresult' } }, 'Unexpected result: win or invalidresult'],
    ])('test results', (input, expected) => {
        let games = JSON.parse(readFileSync(__dirname + '/mock-server/data/chesscom/05.json', 'utf-8'))
        let game: ChessComGame = {
            ...games.games[0],
            ...input,
        }
        expect(() => getResult(game)).toThrowError(expected)
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
