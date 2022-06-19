import { expect, test, vi } from 'vitest'
import { profile, arena, swiss, playerGames, arenaGames, swissGames, qs } from '../src/fetchers/lichess'

test('fetch player', async () => {
    expect.hasAssertions()
    await profile('EricRosen').then((data) => {
        expect(data.site).toStrictEqual('lichess')
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
    await playerGames('EricRosen', function (game) {
        expect(game.site).toBe('lichess')
    }).then(function (done) {
        expect(done).toBe(true)
    })
})

test('fetch player games of someone with no games', async () => {
    const callback = vi.fn(() => {})
    await playerGames('user-with-no-games', callback)
    expect(callback).toHaveBeenCalledTimes(0)
})

test('fetch arena games', async () => {
    expect.assertions(8 + 1)
    await arenaGames('2oEh6hZw', function (game) {
        expect(game.site).toBe('lichess')
    }).then(function (done) {
        expect(done).toBe(true)
    })
})

test('fetch swiss games', async () => {
    expect.assertions(8 + 1)
    await swissGames('48jrx3m6', function (game) {
        expect(game.site).toBe('lichess')
    }).then(function (done) {
        expect(done).toBe(true)
    })
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
