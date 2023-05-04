import { expect, test, vi } from 'vitest'
import {
    profile,
    arena,
    swiss,
    playerGames,
    arenaGames,
    swissGames,
    qs,
    games,
    game,
    teamMembers,
} from '../src/fetchers/lichess'

test('fetch player', async () => {
    expect.hasAssertions()
    await profile('EricRosen').then((data) => {
        expect(data.site).toStrictEqual('lichess')
    })
})

test('fetch player with deleted account', async () => {
    expect.hasAssertions()
    await profile('deleted-user').then((data) => {
        expect(data.disabled).toStrictEqual(true)
    })
})

test('fetch player with marked account', async () => {
    expect.hasAssertions()
    await profile('marked-user').then((data) => {
        expect(data.marked).toStrictEqual(true)
    })
})

test('fetch players of a team', async () => {
    expect.assertions(2 + 1)
    await teamMembers('test-team', (game) => {
        expect(game.site).toBe('lichess')
    }).then((done) => {
        expect(done).toBe(true)
    })
})

test('fetch arena', async () => {
    expect.hasAssertions()
    await arena('2oEh6hZw').then((data) => {
        expect(data.url).toBe('https://lichess.org/tournament/2oEh6hZw')
    })
})

test('fetch swiss', async () => {
    expect.hasAssertions()
    await swiss('48jrx3m6').then((data) => {
        expect(data.url).toBe('https://lichess.org/swiss/48jrx3m6')
    })
})

test('build query string from options', () => {
    expect(qs({ since: 123 })).toBe('?since=123')
    expect(qs({ since: 123, pgnInJson: true })).toBe('?since=123&pgnInJson=true')
})

test('fetch player games', async () => {
    expect.assertions(8 + 1)
    await playerGames('EricRosen', (game) => {
        expect(game.site).toBe('lichess')
    }).then((done) => {
        expect(done).toBe(true)
    })
})

test('fetch player games with params', async () => {
    expect.assertions(4)
    await playerGames(
        'EricRosen',
        (game) => {
            expect(game.site).toBe('lichess')
        },
        {
            since: 16557255145620,
        }
    )
})

test('fetch player games of someone with no games', async () => {
    const callback = vi.fn(() => {})
    await playerGames('user-with-no-games', callback)
    expect(callback).toHaveBeenCalledTimes(0)
})

test('fetch arena games', async () => {
    expect.assertions(8 + 1)
    await arenaGames('2oEh6hZw', (game) => {
        expect(game.site).toBe('lichess')
    }).then((done) => {
        expect(done).toBe(true)
    })
})

test('fetch swiss games', async () => {
    expect.assertions(8 + 1)
    await swissGames('48jrx3m6', (game) => {
        expect(game.site).toBe('lichess')
    }).then((done) => {
        expect(done).toBe(true)
    })
})

test('games', async () => {
    expect(
        games(
            'https://lichess.org/api/games/user/EricRosen',
            vi.fn(() => {})
        )
    ).resolves.toBe(true)
})

test('individual game', async () => {
    expect.assertions(4)
    await game('https://lichess.org/KSMY85yj').then((data) => {
        expect(data.site).toBe('lichess')
    })
    await game('https://lichess.org/KSMY85yj#3').then((data) => {
        expect(data.site).toBe('lichess')
    })
    await game('https://lichess.org/KSMY85yj/black').then((data) => {
        expect(data.site).toBe('lichess')
    })
    await game('https://lichess.org/KSMY85yj/black#3').then((data) => {
        expect(data.site).toBe('lichess')
    })
})

test('individual game using 12-digit game ID', async () => {
    expect.hasAssertions()
    await game('https://lichess.org/KSMY85yjXXXX').then((data) => {
        expect(data.site).toBe('lichess')
    })
})

test('invalid game id', async () => {
    expect(() => game('https://lichess.org/abc')).toThrowError('Invalid game ID: abc')
})

test('not found', async () => {
    await expect(() => profile('user404')).rejects.toThrowError('404: Not Found')
    await expect(() => arena('tournament404')).rejects.toThrowError('404: Not Found')
    await expect(() => swiss('tournament404')).rejects.toThrowError('404: Not Found')

    await expect(() => playerGames('user404', () => {})).rejects.toThrowError('404: Not Found')
    await expect(() => arenaGames('tournament404', () => {})).rejects.toThrowError('404: Not Found')
    await expect(() => swissGames('tournament404', () => {})).rejects.toThrowError('404: Not Found')
})

test('rate limited', async () => {
    await expect(() => profile('user429')).rejects.toThrowError('429: Too Many Requests')
    await expect(() => arena('tournament429')).rejects.toThrowError('429: Too Many Requests')
    await expect(() => swiss('tournament429')).rejects.toThrowError('429: Too Many Requests')

    await expect(() => playerGames('user429', () => {})).rejects.toThrowError('429: Too Many Requests')
    await expect(() => arenaGames('tournament429', () => {})).rejects.toThrowError('429: Too Many Requests')
    await expect(() => swissGames('tournament429', () => {})).rejects.toThrowError('429: Too Many Requests')
})
