import { describe, expect, test } from 'vitest'
import { formatGame, getResult, formatTournament, formatProfile } from '../src/formatters/lichess'
import { readFileSync } from 'fs'
import { LichessGame, Result } from '../src/types'

test('format lichess game (w/ PGN)', () => {
    // sample game from:
    // curl -H 'Accept: application/json' 'https://lichess.org/game/export/6sHZIw5F?pgnInJson=true&evals=false'
    let input: LichessGame = {
        id: '6sHZIw5F',
        rated: true,
        variant: 'standard',
        speed: 'bullet',
        perf: 'bullet',
        createdAt: 1653281234416,
        lastMoveAt: 1653281321482,
        status: 'mate',
        players: {
            white: {
                user: { name: 'patzerplay', title: 'NM', patron: true, id: 'patzerplay' },
                rating: 2591,
                ratingDiff: -4,
            },
            black: {
                user: { name: 'EricRosen', title: 'IM', patron: true, id: 'ericrosen' },
                rating: 2707,
                ratingDiff: 4,
            },
        },
        winner: 'black',
        opening: { eco: 'C21', name: 'Center Game: Lanc-Arnold Gambit', ply: 7 },
        moves: 'e4 e5 Nf3 Bc5 d4 exd4 c3 d3 Bxd3 d6 O-O Nc6 h3 Nf6 Bg5 h6 Bh4 g5 Nxg5 hxg5 Bxg5 Rg8 h4 Ne5 Be2 Qe7 b4 Bb6 a4 a5 Na3 Qe6 Nc2 Nfg4 Nd4 Qg6 Qd2 Bd7 f4 Nc6 f5 Qh5 Rf4 Nce5 Raf1 Rxg5 hxg5 Qh2#',
        pgn: '[Event "Rated Bullet game"]\n[Site "https://lichess.org/6sHZIw5F"]\n[Date "2022.05.23"]\n[White "patzerplay"]\n[Black "EricRosen"]\n[Result "0-1"]\n[UTCDate "2022.05.23"]\n[UTCTime "04:47:14"]\n[WhiteElo "2591"]\n[BlackElo "2707"]\n[WhiteRatingDiff "-4"]\n[BlackRatingDiff "+4"]\n[WhiteTitle "NM"]\n[BlackTitle "IM"]\n[Variant "Standard"]\n[TimeControl "60+0"]\n[ECO "C21"]\n[Opening "Center Game: Lanc-Arnold Gambit"]\n[Termination "Normal"]\n\n1. e4 { [%clk 0:01:00] } 1... e5 { [%clk 0:01:00] } 2. Nf3 { [%clk 0:00:59] } 2... Bc5 { [%clk 0:01:00] } 3. d4 { [%clk 0:00:58] } 3... exd4 { [%clk 0:00:59] } 4. c3 { [%clk 0:00:58] } 4... d3 { [%clk 0:00:58] } 5. Bxd3 { [%clk 0:00:57] } 5... d6 { [%clk 0:00:58] } 6. O-O { [%clk 0:00:56] } 6... Nc6 { [%clk 0:00:57] } 7. h3 { [%clk 0:00:54] } 7... Nf6 { [%clk 0:00:57] } 8. Bg5 { [%clk 0:00:53] } 8... h6 { [%clk 0:00:57] } 9. Bh4 { [%clk 0:00:51] } 9... g5 { [%clk 0:00:56] } 10. Nxg5 { [%clk 0:00:49] } 10... hxg5 { [%clk 0:00:55] } 11. Bxg5 { [%clk 0:00:49] } 11... Rg8 { [%clk 0:00:54] } 12. h4 { [%clk 0:00:48] } 12... Ne5 { [%clk 0:00:54] } 13. Be2 { [%clk 0:00:46] } 13... Qe7 { [%clk 0:00:46] } 14. b4 { [%clk 0:00:42] } 14... Bb6 { [%clk 0:00:45] } 15. a4 { [%clk 0:00:42] } 15... a5 { [%clk 0:00:43] } 16. Na3 { [%clk 0:00:41] } 16... Qe6 { [%clk 0:00:42] } 17. Nc2 { [%clk 0:00:37] } 17... Nfg4 { [%clk 0:00:40] } 18. Nd4 { [%clk 0:00:35] } 18... Qg6 { [%clk 0:00:39] } 19. Qd2 { [%clk 0:00:29] } 19... Bd7 { [%clk 0:00:37] } 20. f4 { [%clk 0:00:29] } 20... Nc6 { [%clk 0:00:34] } 21. f5 { [%clk 0:00:26] } 21... Qh5 { [%clk 0:00:33] } 22. Rf4 { [%clk 0:00:24] } 22... Nce5 { [%clk 0:00:32] } 23. Raf1 { [%clk 0:00:18] } 23... Rxg5 { [%clk 0:00:32] } 24. hxg5 { [%clk 0:00:17] } 24... Qh2# { [%clk 0:00:31] } 0-1\n\n\n',
        clock: { initial: 60, increment: 0, totalTime: 60 },
    }

    let formattedGame = formatGame(input)
    let formattedGameMinusMoves = Object.assign({}, formattedGame, {
        moves: [],
    })

    expect(formattedGameMinusMoves).toEqual({
        site: 'lichess',
        id: '6sHZIw5F',
        links: {
            white: `https://lichess.org/6sHZIw5F`,
            black: `https://lichess.org/6sHZIw5F/black`,
        },

        timestamp: 1653281234416,
        isStandard: true,

        result: {
            winner: 'black',
            via: 'checkmate',
            label: '0-1',
        },

        moves: [],
        players: {
            white: {
                username: 'patzerplay',
                title: 'NM',
                rating: 2591,
            },
            black: {
                username: 'EricRosen',
                title: 'IM',
                rating: 2707,
            },
        },
        timeControl: {
            initial: 60,
            increment: 0,
        },
        opening: {
            name: 'Center Game: Lanc-Arnold Gambit',
            eco: 'C21',
        },
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('e4')
    expect(formattedGame.moves.length).toBe(input.moves?.split(' ').length)
})

test('format lichess game (w/o PGN)', () => {
    // sample game from:
    // curl -H 'Accept: application/json' 'https://lichess.org/game/export/6sHZIw5F?evals=false'
    let input: LichessGame = {
        id: '6sHZIw5F',
        rated: true,
        variant: 'standard',
        speed: 'bullet',
        perf: 'bullet',
        createdAt: 1653281234416,
        lastMoveAt: 1653281321482,
        status: 'mate',
        players: {
            white: {
                user: { name: 'patzerplay', title: 'NM', patron: true, id: 'patzerplay' },
                rating: 2591,
                ratingDiff: -4,
            },
            black: {
                user: { name: 'EricRosen', title: 'IM', patron: true, id: 'ericrosen' },
                rating: 2707,
                ratingDiff: 4,
            },
        },
        winner: 'black',
        opening: { eco: 'C21', name: 'Center Game: Lanc-Arnold Gambit', ply: 7 },
        moves: 'e4 e5 Nf3 Bc5 d4 exd4 c3 d3 Bxd3 d6 O-O Nc6 h3 Nf6 Bg5 h6 Bh4 g5 Nxg5 hxg5 Bxg5 Rg8 h4 Ne5 Be2 Qe7 b4 Bb6 a4 a5 Na3 Qe6 Nc2 Nfg4 Nd4 Qg6 Qd2 Bd7 f4 Nc6 f5 Qh5 Rf4 Nce5 Raf1 Rxg5 hxg5 Qh2#',
        clock: { initial: 60, increment: 0, totalTime: 60 },
    }

    let formattedGame = formatGame(input)
    let formattedGameMinusMoves = Object.assign({}, formattedGame, {
        moves: [],
    })

    expect(formattedGameMinusMoves).toEqual({
        site: 'lichess',
        id: '6sHZIw5F',
        links: {
            white: `https://lichess.org/6sHZIw5F`,
            black: `https://lichess.org/6sHZIw5F/black`,
        },

        timestamp: 1653281234416,
        isStandard: true,

        result: {
            winner: 'black',
            via: 'checkmate',
            label: '0-1',
        },

        moves: [],
        players: {
            white: {
                username: 'patzerplay',
                title: 'NM',
                rating: 2591,
            },
            black: {
                username: 'EricRosen',
                title: 'IM',
                rating: 2707,
            },
        },
        timeControl: {
            initial: 60,
            increment: 0,
        },
        opening: {
            name: 'Center Game: Lanc-Arnold Gambit',
            eco: 'C21',
        },
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('e4')
    expect(formattedGame.moves.length).toBe(input.moves?.split(' ').length)
})

describe('results', () => {
    test.each<[Partial<LichessGame>, Result]>([
        // draws
        [{ status: 'stalemate' }, { outcome: 'draw', via: 'stalemate', label: '½-½' }],
        [{ status: 'draw' }, { outcome: 'draw', label: '½-½' }],
        // wins/losses
        [
            { status: 'mate', winner: 'black' },
            { winner: 'black', via: 'checkmate', label: '0-1' },
        ],
        [
            { status: 'resign', winner: 'black' },
            {
                winner: 'black',
                via: 'resignation',
                label: '0-1',
            },
        ],
        [
            { status: 'resign', winner: 'white' },
            {
                winner: 'white',
                via: 'resignation',
                label: '1-0',
            },
        ],
        [
            { status: 'outoftime', winner: 'black' },
            { winner: 'black', via: 'timeout', label: '0-1' },
        ],
        [
            { status: 'outoftime', winner: 'white' },
            { winner: 'white', via: 'timeout', label: '1-0' },
        ],
        [
            { status: 'timeout', winner: 'white' },
            { winner: 'white', via: 'abandonment', label: '1-0' },
        ],
        [
            { status: 'timeout', winner: 'black' },
            { winner: 'black', via: 'abandonment', label: '0-1' },
        ],
        [
            { status: 'variantEnd', winner: 'white' },
            { winner: 'white', via: 'variant', label: '1-0' },
        ],
        [
            { status: 'variantEnd', winner: 'black' },
            { winner: 'black', via: 'variant', label: '0-1' },
        ],
        [
            { status: 'noStart', winner: 'black' },
            { winner: 'black', via: 'noStart', label: '0-1' },
        ],
        [
            { status: 'noStart', winner: 'white' },
            { winner: 'white', via: 'noStart', label: '1-0' },
        ],
    ])('test results', (input, expected) => {
        expect(getResult(input)).toStrictEqual(expected)
    })
})

test('test game end by cheat detection (same position in analysis board)', () => {
    // sample game from:
    // curl -H 'Accept: application/json' 'https://lichess.org/game/export/qwbLhewv?evals=false'

    let input: LichessGame = {
        id: 'qwbLhewv',
        rated: false,
        variant: 'fromPosition',
        speed: 'rapid',
        perf: 'fromPosition',
        createdAt: 1660763693169,
        lastMoveAt: 1660764265251,
        status: 'cheat',
        players: {
            white: { user: { name: 'rufusson_dufus', patron: true, id: 'rufusson_dufus' }, rating: 2417 },
            black: { user: { name: 'Xiong_Jina', id: 'xiong_jina' }, rating: 2260 },
        },
        initialFen: 'r2q1rk1/pb3p1p/2p2np1/8/1p1bPPnN/6P1/PPQ1B2P/R1BN1R1K w - - 2 18',
        winner: 'white',
        moves: 'Bf3 Qb6 e5 Rae8 Ng2 Ba6 Re1 Bf2 Re2 Bxe2 Qxe2 h5 Qf1 Bd4 exf6',
        clock: { initial: 600, increment: 5, totalTime: 800 },
    }
    let formattedGame = formatGame(input)

    expect(formattedGame.result).toStrictEqual({ winner: 'white', via: 'cheat', label: '1-0' })
})

describe('test invalid result', () => {
    test.each<Partial<LichessGame>>([{ status: 'invalidresult' }])('test results', async (input) => {
        await expect(() => getResult(input)).toThrowError(/Unexpected result/)
    })
})

test('format lichess player', () => {
    let player = JSON.parse(readFileSync(__dirname + '/mock-server/data/lichess/player.json', 'utf-8'))

    expect(formatProfile(player)).toStrictEqual({
        site: 'lichess',
        username: 'EricRosen',
        title: 'IM',
        createdAt: 1433434819500,
        lastSeenAt: 1654377224603,
        link: 'https://lichess.org/@/EricRosen',
        location: 'St. Louis',
        name: 'Eric Rosen',

        ratings: {
            bullet: {
                rating: 2747,
                games: 15727,
            },
            blitz: {
                rating: 2603,
                games: 5383,
            },
            rapid: {
                rating: 2621,
                games: 982,
            },
        },

        counts: {
            all: 28015,
        },
    })
})

test('format lichess player with blank profile', () => {
    let player = JSON.parse(readFileSync(__dirname + '/mock-server/data/lichess/player-without-profile.json', 'utf-8'))

    expect(formatProfile(player)).toStrictEqual({
        site: 'lichess',
        username: 'blank-user',
        title: '',
        createdAt: 1290460176000,
        lastSeenAt: 1655592839278,
        link: 'https://lichess.org/@/blank-user',
        location: '',
        name: '',

        ratings: {
            bullet: {
                rating: 1500,
                games: 0,
            },
            blitz: {
                rating: 1500,
                games: 0,
            },
            rapid: {
                rating: 1500,
                games: 0,
            },
        },

        counts: {
            all: 0,
        },
    })
})

test('format lichess arena', () => {
    let arena = JSON.parse(readFileSync(__dirname + '/mock-server/data/lichess/arena.json', 'utf-8'))

    expect(formatTournament(arena)).toStrictEqual({
        id: '2oEh6hZw',
        type: 'arena',
        site: 'lichess',
        url: 'https://lichess.org/tournament/2oEh6hZw',
        name: 'Yearly Blitz Arena',
        timeControl: {
            initial: 300,
            increment: 0,
        },
        isFinished: true,
        playerCount: 8907,
        stats: {
            games: 35401,
        },
    })
})

test('format lichess swiss', () => {
    let arena = JSON.parse(readFileSync(__dirname + '/mock-server/data/lichess/swiss.json', 'utf-8'))

    expect(formatTournament(arena)).toStrictEqual({
        id: '48jrx3m6',
        type: 'swiss',
        site: 'lichess',
        url: 'https://lichess.org/swiss/48jrx3m6',
        name: 'Ukraine Charity Tournament',
        timeControl: {
            initial: 300,
            increment: 2,
        },
        isFinished: true,
        playerCount: 414,
        stats: {
            games: 847,
        },
    })
})
