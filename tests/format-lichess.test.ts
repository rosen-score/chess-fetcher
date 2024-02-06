import { describe, expect, test } from 'vitest'
import { formatGame, getResult, formatTournament, formatProfile } from '../src/formatters/lichess'
import { readFileSync } from 'fs'
import { LichessGame, Result } from '../src/types'

test('format lichess game (w/ PGN + clocks)', () => {
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
            white: { user: { name: 'patzerplay', title: 'NM', id: 'patzerplay' }, rating: 2591, ratingDiff: -4 },
            black: {
                user: { name: 'EricRosen', title: 'IM', patron: true, id: 'ericrosen' },
                rating: 2707,
                ratingDiff: 4,
            },
        },
        winner: 'black',
        opening: { eco: 'C21', name: 'Center Game: Lanc-Arnold Gambit', ply: 7 },
        moves: 'e4 e5 Nf3 Bc5 d4 exd4 c3 d3 Bxd3 d6 O-O Nc6 h3 Nf6 Bg5 h6 Bh4 g5 Nxg5 hxg5 Bxg5 Rg8 h4 Ne5 Be2 Qe7 b4 Bb6 a4 a5 Na3 Qe6 Nc2 Nfg4 Nd4 Qg6 Qd2 Bd7 f4 Nc6 f5 Qh5 Rf4 Nce5 Raf1 Rxg5 hxg5 Qh2#',
        clocks: [
            6003, 6003, 5891, 5971, 5827, 5859, 5787, 5819, 5715, 5779, 5611, 5747, 5363, 5707, 5267, 5667, 5131, 5627,
            4939, 5491, 4939, 5411, 4787, 5371, 4595, 4555, 4227, 4459, 4171, 4323, 4051, 4195, 3659, 4035, 3467, 3899,
            2931, 3683, 2851, 3371, 2619, 3275, 2443, 3187, 1755, 3155, 1677, 3072,
        ],
        pgn: '[Event "Rated Bullet game"]\n[Site "https://lichess.org/6sHZIw5F"]\n[Date "2022.05.23"]\n[White "patzerplay"]\n[Black "EricRosen"]\n[Result "0-1"]\n[UTCDate "2022.05.23"]\n[UTCTime "04:47:14"]\n[WhiteElo "2591"]\n[BlackElo "2707"]\n[WhiteRatingDiff "-4"]\n[BlackRatingDiff "+4"]\n[WhiteTitle "NM"]\n[BlackTitle "IM"]\n[Variant "Standard"]\n[TimeControl "60+0"]\n[ECO "C21"]\n[Opening "Center Game: Lanc-Arnold Gambit"]\n[Termination "Normal"]\n\n1. e4 { [%clk 0:01:00] } 1... e5 { [%clk 0:01:00] } 2. Nf3 { [%clk 0:00:59] } 2... Bc5 { [%clk 0:01:00] } 3. d4 { [%clk 0:00:58] } 3... exd4 { [%clk 0:00:59] } 4. c3 { [%clk 0:00:58] } 4... d3 { [%clk 0:00:58] } 5. Bxd3 { [%clk 0:00:57] } 5... d6 { [%clk 0:00:58] } 6. O-O { [%clk 0:00:56] } 6... Nc6 { [%clk 0:00:57] } 7. h3 { [%clk 0:00:54] } 7... Nf6 { [%clk 0:00:57] } 8. Bg5 { [%clk 0:00:53] } 8... h6 { [%clk 0:00:57] } 9. Bh4 { [%clk 0:00:51] } 9... g5 { [%clk 0:00:56] } 10. Nxg5 { [%clk 0:00:49] } 10... hxg5 { [%clk 0:00:55] } 11. Bxg5 { [%clk 0:00:49] } 11... Rg8 { [%clk 0:00:54] } 12. h4 { [%clk 0:00:48] } 12... Ne5 { [%clk 0:00:54] } 13. Be2 { [%clk 0:00:46] } 13... Qe7 { [%clk 0:00:46] } 14. b4 { [%clk 0:00:42] } 14... Bb6 { [%clk 0:00:45] } 15. a4 { [%clk 0:00:42] } 15... a5 { [%clk 0:00:43] } 16. Na3 { [%clk 0:00:41] } 16... Qe6 { [%clk 0:00:42] } 17. Nc2 { [%clk 0:00:37] } 17... Nfg4 { [%clk 0:00:40] } 18. Nd4 { [%clk 0:00:35] } 18... Qg6 { [%clk 0:00:39] } 19. Qd2 { [%clk 0:00:29] } 19... Bd7 { [%clk 0:00:37] } 20. f4 { [%clk 0:00:29] } 20... Nc6 { [%clk 0:00:34] } 21. f5 { [%clk 0:00:26] } 21... Qh5 { [%clk 0:00:33] } 22. Rf4 { [%clk 0:00:24] } 22... Nce5 { [%clk 0:00:32] } 23. Raf1 { [%clk 0:00:18] } 23... Rxg5 { [%clk 0:00:32] } 24. hxg5 { [%clk 0:00:17] } 24... Qh2# { [%clk 0:00:31] } 0-1\n\n\n',
        clock: { initial: 60, increment: 0, totalTime: 60 },
    }

    let formattedGame = formatGame(input)
    let formattedGameMinusMoves = {
        ...formattedGame,
        ...{
            moves: [],
        },
    }

    expect(formattedGameMinusMoves).toEqual({
        site: 'lichess',
        type: 'game',
        id: '6sHZIw5F',
        links: {
            white: `https://lichess.org/6sHZIw5F`,
            black: `https://lichess.org/6sHZIw5F/black`,
        },

        timestamp: 1653281234416,
        lastMoveAt: 1653281321482,
        isStandard: true,

        result: {
            winner: 'black',
            via: 'checkmate',
            label: '0-1',
        },

        moves: [],
        clocks: [
            6003, 6003, 5891, 5971, 5827, 5859, 5787, 5819, 5715, 5779, 5611, 5747, 5363, 5707, 5267, 5667, 5131, 5627,
            4939, 5491, 4939, 5411, 4787, 5371, 4595, 4555, 4227, 4459, 4171, 4323, 4051, 4195, 3659, 4035, 3467, 3899,
            2931, 3683, 2851, 3371, 2619, 3275, 2443, 3187, 1755, 3155, 1677, 3072,
        ],
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
        analysis: [],
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('e4')
    expect(formattedGame.moves.length).toBe(input.moves?.split(' ').length)
})

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
    let formattedGameMinusMoves = {
        ...formattedGame,
        ...{
            moves: [],
        },
    }

    expect(formattedGameMinusMoves).toEqual({
        site: 'lichess',
        type: 'game',
        id: '6sHZIw5F',
        links: {
            white: `https://lichess.org/6sHZIw5F`,
            black: `https://lichess.org/6sHZIw5F/black`,
        },

        timestamp: 1653281234416,
        lastMoveAt: 1653281321482,
        isStandard: true,

        result: {
            winner: 'black',
            via: 'checkmate',
            label: '0-1',
        },

        moves: [],
        clocks: [],
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
        analysis: [],
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
    let formattedGameMinusMoves = {
        ...formattedGame,
        ...{
            moves: [],
        },
    }

    expect(formattedGameMinusMoves).toEqual({
        site: 'lichess',
        type: 'game',
        id: '6sHZIw5F',
        links: {
            white: `https://lichess.org/6sHZIw5F`,
            black: `https://lichess.org/6sHZIw5F/black`,
        },

        timestamp: 1653281234416,
        lastMoveAt: 1653281321482,
        isStandard: true,

        result: {
            winner: 'black',
            via: 'checkmate',
            label: '0-1',
        },

        moves: [],
        clocks: [],
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
        analysis: [],
    })

    expect(formattedGame.moves).toBeInstanceOf(Array)
    expect(formattedGame.moves[0]).toBeInstanceOf(Object)
    expect(formattedGame.moves[0].notation.notation).toBe('e4')
    expect(formattedGame.moves.length).toBe(input.moves?.split(' ').length)
})

test('format lichess game (w/ evals)', () => {
    // sample game from:
    // curl -H 'Accept: application/json' 'https://lichess.org/game/export/6sHZIw5F?evals=true'
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
                user: { name: 'patzerplay', title: 'NM', id: 'patzerplay' },
                rating: 2591,
                ratingDiff: -4,
                analysis: { inaccuracy: 3, mistake: 3, blunder: 4, acpl: 144 },
            },
            black: {
                user: { name: 'EricRosen', title: 'IM', patron: true, id: 'ericrosen' },
                rating: 2707,
                ratingDiff: 4,
                analysis: { inaccuracy: 3, mistake: 4, blunder: 2, acpl: 108 },
            },
        },
        winner: 'black',
        opening: { eco: 'C21', name: 'Center Game: Lanc-Arnold Gambit', ply: 7 },
        moves: 'e4 e5 Nf3 Bc5 d4 exd4 c3 d3 Bxd3 d6 O-O Nc6 h3 Nf6 Bg5 h6 Bh4 g5 Nxg5 hxg5 Bxg5 Rg8 h4 Ne5 Be2 Qe7 b4 Bb6 a4 a5 Na3 Qe6 Nc2 Nfg4 Nd4 Qg6 Qd2 Bd7 f4 Nc6 f5 Qh5 Rf4 Nce5 Raf1 Rxg5 hxg5 Qh2#',
        clocks: [
            6003, 6003, 5891, 5971, 5827, 5859, 5787, 5819, 5715, 5779, 5611, 5747, 5363, 5707, 5267, 5667, 5131, 5627,
            4939, 5491, 4939, 5411, 4787, 5371, 4595, 4555, 4227, 4459, 4171, 4323, 4051, 4195, 3659, 4035, 3467, 3899,
            2931, 3683, 2851, 3371, 2619, 3275, 2443, 3187, 1755, 3155, 1677, 3072,
        ],
        analysis: [
            { eval: 33 },
            { eval: 12 },
            { eval: 19 },
            {
                eval: 218,
                best: 'b8c6',
                variation: 'Nc6 Bb5 Nf6 d3 Bc5 c3 O-O O-O d5 Nbd2',
                judgment: { name: 'Blunder', comment: 'Blunder. Nc6 was best.' },
            },
            {
                eval: 0,
                best: 'f3e5',
                variation: 'Nxe5 Nc6 Nxc6 dxc6 Qe2 Be6 d3 Qe7 Nc3 Bd4',
                judgment: { name: 'Blunder', comment: 'Blunder. Nxe5 was best.' },
            },
            { eval: 0 },
            { eval: -36 },
            {
                eval: 89,
                best: 'd4c3',
                variation: 'dxc3 Nxc3 d6 Bc4 Nf6 e5 dxe5 Qxd8+ Kxd8 Nxe5',
                judgment: { name: 'Mistake', comment: 'Mistake. dxc3 was best.' },
            },
            { eval: 66 },
            { eval: 94 },
            { eval: 58 },
            { eval: 96 },
            { eval: 59 },
            { eval: 90 },
            {
                eval: -10,
                best: 'b2b4',
                variation: 'b4 Bb6 Nbd2 Be6 Nc4 Bxc4 Bxc4 a5 b5 Ne5',
                judgment: { name: 'Inaccuracy', comment: 'Inaccuracy. b4 was best.' },
            },
            { eval: -37 },
            { eval: -45 },
            { eval: -48 },
            {
                eval: -710,
                best: 'b2b4',
                variation: 'b4 Bb6 a4 a5 Bg3 Nh5 Bh2 g4 hxg4 Bxg4 Nbd2 Rg8 Nc4 Ba7',
                judgment: { name: 'Blunder', comment: 'Blunder. b4 was best.' },
            },
            { eval: -660 },
            { eval: -717 },
            {
                eval: -470,
                best: 'c8h3',
                variation: 'Bxh3 gxh3 Rg8 Kh2 Rxg5 b4 Bb6 a4 Rg8 Be2 a5 f4 Qe7 Nd2',
                judgment: { name: 'Inaccuracy', comment: 'Inaccuracy. Bxh3 was best.' },
            },
            { eval: -546 },
            {
                eval: -418,
                best: 'g8g5',
                variation: 'Rxg5 hxg5 Ng4 Qc1 Qe7 Be2 Qe5 Bxg4 Bxg4 b4 Bb6 Nd2 Qxg5 Nc4',
                judgment: { name: 'Inaccuracy', comment: 'Inaccuracy. Rxg5 was best.' },
            },
            { eval: -491 },
            {
                eval: -385,
                best: 'c8e6',
                variation: 'Be6 b4 Bb6 Qc1 Rxg5 Qxg5 Nxe4 Qf4 f5 c4 Bd4 Nd2 Nxd2 Qxd4',
                judgment: { name: 'Inaccuracy', comment: 'Inaccuracy. Be6 was best.' },
            },
            { eval: -412 },
            { eval: -410 },
            { eval: -434 },
            { eval: -356 },
            {
                eval: -472,
                best: 'b1d2',
                variation: 'Nd2',
                judgment: { name: 'Inaccuracy', comment: 'Inaccuracy. Nd2 was best.' },
            },
            { eval: -391 },
            {
                eval: -707,
                best: 'b4a5',
                variation: 'bxa5 Rxa5 Rb1 Nxe4 Rxb6 Nxg5 hxg5 Rd5 Nb5 Rxd1 Nxc7+ Ke7 Nxe6 Rxf1+',
                judgment: { name: 'Mistake', comment: 'Mistake. bxa5 was best.' },
            },
            {
                eval: -334,
                best: 'f6e4',
                variation: 'Nxe4 Nd4 Qg6 Qc1 axb4 a5 Rxa5 Rxa5 Bxa5 f4 bxc3 Qe3 Bb6 h5',
                judgment: { name: 'Blunder', comment: 'Blunder. Nxe4 was best.' },
            },
            { eval: -378 },
            { eval: -370 },
            {
                eval: -584,
                best: 'g2g3',
                variation: 'g3 Qh7',
                judgment: { name: 'Inaccuracy', comment: 'Inaccuracy. g3 was best.' },
            },
            {
                eval: -367,
                best: 'f7f6',
                variation: 'f6',
                judgment: { name: 'Mistake', comment: 'Mistake. f6 was best.' },
            },
            { eval: -400 },
            {
                eval: -195,
                best: 'f7f6',
                variation: 'f6',
                judgment: { name: 'Mistake', comment: 'Mistake. f6 was best.' },
            },
            {
                eval: -333,
                best: 'b4a5',
                variation: 'bxa5 Bc5',
                judgment: { name: 'Mistake', comment: 'Mistake. bxa5 was best.' },
            },
            { eval: -302 },
            {
                eval: -860,
                best: 'b4a5',
                variation: 'bxa5 Rxa5 Kh1 Nxd4 cxd4 Rxg5 Qxg5 Qxg5 hxg5 Ne3 Rf4 Bxd4 Rb1 b6',
                judgment: { name: 'Blunder', comment: 'Blunder. bxa5 was best.' },
            },
            {
                eval: -394,
                best: 'g8g5',
                variation: 'Rxg5 bxa5 Rxa5 g3 Rg8 Rb1 Nce5 Rxb6 cxb6 Qb2 Qh6 Qxb6 Nf6 Kf2',
                judgment: { name: 'Mistake', comment: 'Mistake. Rxg5 was best.' },
            },
            {
                eval: -924,
                best: 'f4g4',
                variation: 'Rxg4 Nxg4 b5 Kf8 Qf4 Qh8 Rd1 Ne5 f6 Ke8 g4 Kd8 Kg2 Kc8',
                judgment: { name: 'Blunder', comment: 'Blunder. Rxg4 was best.' },
            },
            { eval: -860 },
            {
                mate: -1,
                best: 'g2g3',
                variation: 'g3 Rg8 Kh1 Qh8 bxa5 Rxa5 Rb1 Qf6 Rxb6 cxb6 Nb5 Kf8 Kg2 Rxa4',
                judgment: { name: 'Mistake', comment: 'Checkmate is now unavoidable. g3 was best.' },
            },
        ],
        clock: { initial: 60, increment: 0, totalTime: 60 },
    }

    let formattedGame = formatGame(input)
    expect(formattedGame.analysis).toStrictEqual(input.analysis)
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
        expect(() => getResult(input)).toThrowError(/Unexpected result/)
    })
})

test('format lichess player', () => {
    let player = JSON.parse(readFileSync(__dirname + '/mock-server/data/lichess/player.json', 'utf-8'))

    expect(formatProfile(player)).toStrictEqual({
        site: 'lichess',
        type: 'profile',
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

        marked: false,
    })
})

test('format lichess player with blank profile', () => {
    let player = JSON.parse(readFileSync(__dirname + '/mock-server/data/lichess/player-without-profile.json', 'utf-8'))

    expect(formatProfile(player)).toStrictEqual({
        site: 'lichess',
        type: 'profile',
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

        counts: {},

        marked: false,
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
