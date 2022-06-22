import { describe, expect, test } from 'vitest'
import { games, player, tournament } from '../src/api'

describe('fetching a player profile', () => {
    test('from lichess', async () => {
        expect.hasAssertions()
        await player('https://lichess.org/@/EricRosen').then((data) => {
            expect(data.site).toStrictEqual('lichess')
            expect(data.username).toStrictEqual('EricRosen')
        })
    })
    test('from chess.com', async () => {
        expect.hasAssertions()
        await player('https://www.chess.com/member/imrosen').then((data) => {
            expect(data.site).toStrictEqual('chess.com')
            expect(data.username).toStrictEqual('imrosen')
        })
    })
})

describe('fetching a tournament', () => {
    test('lichess arena', async () => {
        expect.hasAssertions()
        await tournament('https://lichess.org/tournament/2oEh6hZw').then((data) => {
            expect(data.site).toStrictEqual('lichess')
        })
    })
    test('lichess swiss', async () => {
        expect.hasAssertions()
        await tournament('https://lichess.org/swiss/48jrx3m6').then((data) => {
            expect(data.site).toStrictEqual('lichess')
        })
    })
    test('chess.com arena', async () => {
        expect.hasAssertions()
        await tournament('https://www.chess.com/tournament/live/arena/10-bullet-1925132').then((data) => {
            expect(data.site).toStrictEqual('chess.com')
        })
    })
    test('chess.com swiss', async () => {
        expect.hasAssertions()
        await tournament('https://www.chess.com/tournament/live/late-titled-tuesday-blitz-june-07-2022-3192103').then(
            (data) => {
                expect(data.site).toStrictEqual('chess.com')
            }
        )
    })
})

describe('fetching games', () => {
    test('of a lichess player', async () => {
        expect.assertions(8 + 1)
        await games('https://lichess.org/@/EricRosen', (game) => {
            expect(game.site).toBe('lichess')
        }).then((done) => {
            expect(done).toBe(true)
        })
    })
    test('of a chess.com player', async () => {
        expect.assertions(15 + 1)
        await games('https://www.chess.com/member/imrosen', (game) => {
            expect(game.site).toBe('chess.com')
        }).then((done) => {
            expect(done).toBe(true)
        })
    })
    test('of a lichess arena', async () => {
        expect.assertions(8 + 1)
        await games('https://lichess.org/tournament/2oEh6hZw', (game) => {
            expect(game.site).toBe('lichess')
        }).then((done) => {
            expect(done).toBe(true)
        })
    })
    test('of a lichess swiss', async () => {
        expect.assertions(8 + 1)
        await games('https://lichess.org/swiss/48jrx3m6', (game) => {
            expect(game.site).toBe('lichess')
        }).then((done) => {
            expect(done).toBe(true)
        })
    })
    test('of a chess.com arena', async () => {
        expect.assertions(5 + 1)
        await games('https://www.chess.com/tournament/live/arena/10-bullet-1925132', (game) => {
            expect(game.site).toBe('chess.com')
        }).then((done) => {
            expect(done).toBe(true)
        })
    })
    test('of a chess.com swiss', async () => {
        expect.assertions(5 + 1)
        await games('https://www.chess.com/tournament/live/late-titled-tuesday-blitz-june-07-2022-3192103', (game) => {
            expect(game.site).toBe('chess.com')
        }).then((done) => {
            expect(done).toBe(true)
        })
    })
})

describe('fetching games with params', () => {
    test('of a lichess player', async () => {
        expect.assertions(4)
        await games(
            'https://lichess.org/@/EricRosen',
            (game) => {
                expect(game.site).toBe('lichess')
            },
            {
                since: 16557255145620,
            }
        )
    })
    test('of a chess.com player', async () => {
        expect.assertions(3)
        await games(
            'https://www.chess.com/member/imrosen',
            (game) => {
                expect(game.site).toBe('chess.com')
            },
            {
                since: 1651591721000,
            }
        )
    })
})

describe('test invalid inputs', () => {
    test('for player', () => {
        expect(() => player('invalid-input')).toThrowError(
            'Must specify the URL to a Lichess or Chess.com player profile'
        )
    })

    test('for tournament', () => {
        expect(() => tournament('invalid')).toThrowError('Invalid tournament URL')
    })

    test('for games', () => {
        expect(() => games('invalid', () => {})).toThrowError(
            'Must specify the URL to a Lichess or Chess.com player profile or tournament'
        )
    })
})
