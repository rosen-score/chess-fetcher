import { beforeEach, describe, expect, test } from 'vitest'
import { game, games, info, player, players, tournament } from '../src/api'
import { addLichessOauthToken, fetchFromEndpoint, resetOauthToken } from '../src/fetchers/fetch'

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
            expect(data.username).toStrictEqual('IMRosen')
        })
    })
})

describe('fetching players of a team', () => {
    test('from lichess', async () => {
        expect.assertions(2 + 1)
        await players('https://lichess.org/team/test-team', (player) => {
            expect(player.site).toBe('lichess')
        }).then((done) => {
            expect(done).toBe(true)
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

describe('fetching either a profile or a tournament', () => {
    test('player from lichess', async () => {
        expect.hasAssertions()
        await info('https://lichess.org/@/EricRosen').then((data) => {
            expect(data.site).toStrictEqual('lichess')
            expect(data.type).toStrictEqual('profile')
        })
    })
    test('player from chess.com', async () => {
        expect.hasAssertions()
        await info('https://www.chess.com/member/imrosen').then((data) => {
            expect(data.site).toStrictEqual('chess.com')
            expect(data.type).toStrictEqual('profile')
        })
    })
    test('tournament from lichess', async () => {
        expect.hasAssertions()
        await info('https://lichess.org/tournament/2oEh6hZw').then((data) => {
            expect(data.site).toStrictEqual('lichess')
            expect(data.type).toStrictEqual('arena')
        })
    })
    test('tournament from chess.com', async () => {
        expect.hasAssertions()
        await info('https://www.chess.com/tournament/live/arena/10-bullet-1925132').then((data) => {
            expect(data.site).toStrictEqual('chess.com')
            expect(data.type).toStrictEqual('arena')
        })
    })
})

describe('fetching an individual game', () => {
    test('from lichess', async () => {
        expect.hasAssertions()
        await game('https://lichess.org/KSMY85yj').then((data) => {
            expect(data.site).toStrictEqual('lichess')
        })
    })
    test('from chess.com', async () => {
        expect.hasAssertions()
        await game('https://www.chess.com/game/live/45328864849').then((data) => {
            expect(data.site).toStrictEqual('chess.com')
        })
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

    test('for team members', () => {
        expect(() => players('invalid-input', () => {})).toThrowError('Must specify the URL of a Lichess team')
    })

    test('for tournament', () => {
        expect(() => tournament('invalid')).toThrowError('Invalid tournament URL')
    })

    test('for info (either player or tournament)', () => {
        expect(() => info('invalid')).toThrowError('Invalid profile or tournament URL')
    })

    test('for games', () => {
        expect(() => games('invalid', () => {})).toThrowError(
            'Must specify the URL to a Lichess or Chess.com player profile or tournament'
        )
    })

    test('for individual game', () => {
        expect(() => game('invalid')).toThrowError('Must specify the URL to a Lichess or Chess.com game')
    })
})

describe('test lichess oauth token', () => {
    beforeEach(() => {
        resetOauthToken()
    })

    test('token is added to Lichess requests', async () => {
        addLichessOauthToken('my-token')
        await fetchFromEndpoint(`https://lichess.org/debug-headers`)
            .then((response) => response.json())
            .then((data) => {
                expect(data).toHaveProperty('authorization')
                expect(data.authorization).toStrictEqual('Bearer my-token')
            })
    })

    test('token is not added to Chess.com requests', async () => {
        addLichessOauthToken('my-token')
        await fetchFromEndpoint(`https://api.chess.com/debug-headers`)
            .then((response) => response.json())
            .then((data) => {
                expect(data).not.toHaveProperty('authorization')
            })
    })

    test('no token to lichess', async () => {
        await fetchFromEndpoint(`https://lichess.org/debug-headers`)
            .then((response) => response.json())
            .then((data) => {
                expect(data).not.toHaveProperty('authorization')
            })
    })

    test('no token to Chess.com', async () => {
        await fetchFromEndpoint(`https://api.chess.com/debug-headers`)
            .then((response) => response.json())
            .then((data) => {
                expect(data).not.toHaveProperty('authorization')
            })
    })
})
