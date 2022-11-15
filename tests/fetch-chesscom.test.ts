import { describe, expect, test } from 'vitest'
import {
    archive,
    archives,
    game,
    playerGames,
    profile,
    stats,
    titledPlayers,
    tournament,
    tournamentGames,
} from '../src/fetchers/chesscom'
import { Game } from '../src/types'

test('fetch player profile', async () => {
    expect.hasAssertions()
    await profile('imrosen').then((data) => {
        expect(data.site).toBe('chess.com')
    })
})

test('fetch player archives', async () => {
    expect.hasAssertions()
    await archives('imrosen').then((data) => {
        expect(data.archives).toHaveLength(3)
    })
})

test('fetch single month archive', async () => {
    expect.hasAssertions()
    await archive('https://api.chess.com/pub/player/imrosen/games/2022/05').then((data) => {
        expect(data.games).toHaveLength(5)
    })
})

test('fetch player games', async () => {
    // there are 15 games in the test files
    expect.assertions(15 + 1)

    await playerGames('imrosen', (game) => {
        expect(game.site).toBe('chess.com')
    }).then((done) => {
        expect(done).toBe(true)
    })
})

test('fetch player games w/ invalid filter', () => {
    expect(() =>
        playerGames('imrosen', () => {}, {
            since: 1651591721,
        })
    ).toThrowError(/Invalid timestamp format/)
})

test('fetch player games w/ since filter', async () => {
    let matchingGameIds: Array<string> = []

    await playerGames('imrosen', (game) => matchingGameIds.push(game.id), {
        since: 1651591721000,
    })

    expect(matchingGameIds).toStrictEqual(['45331880249', '45331170609', '45330568705'])
})

test('fetch player games w/ max filter', async () => {
    let matchingGameIds: Array<string> = []

    await playerGames('imrosen', (game) => matchingGameIds.push(game.id), {
        max: 2,
    })

    expect(matchingGameIds).toStrictEqual(['45331880249', '45331170609'])
})

test('fetch titled players', () => {
    return titledPlayers().then((players) => {
        expect(players).toStrictEqual({
            zhigalko_sergei: 'GM',
            ajian: 'NM',
            imrosen: 'IM',
            'player-cm': 'CM',
            'player-fm': 'FM',
            'player-gm': 'GM',
            'player-im': 'IM',
            'player-nm': 'NM',
            'player-wcm': 'WCM',
            'player-wfm': 'WFM',
            'player-wgm': 'WGM',
            'player-wim': 'WIM',
            'player-wnm': 'WNM',
        })
    })
})

test('fetch titled players of a specific title', () => {
    return titledPlayers(['GM', 'IM']).then((players) => {
        expect(players).toStrictEqual({
            zhigalko_sergei: 'GM',
            imrosen: 'IM',
            'player-gm': 'GM',
            'player-im': 'IM',
        })
    })
})

test('fetch player stats', async () => {
    expect.hasAssertions()
    await stats('imrosen').then((data) => {
        expect(data['fide']).toBe(2450)
    })
})

test('fetch tournament', async () => {
    expect.hasAssertions()
    await tournament('late-titled-tuesday-blitz-june-07-2022-3192103').then((data) => {
        expect(data.name).toBe('Late-Titled-Tuesday-Blitz-June-07-2022')
        expect(data.site).toBe('chess.com')
    })
})

test('fetch tournament games (arena)', async () => {
    // there are 5 games in the test files
    expect.assertions(5 + 1)

    await tournamentGames('10-bullet-1925132', (game) => {
        expect(game.site).toBe('chess.com')
    }).then((data) => {
        expect(data).toBe(true)
    })
})

test('fetch tournament games (swiss)', async () => {
    // there are 5 games in the test files
    expect.assertions(5 + 1)

    await tournamentGames('late-titled-tuesday-blitz-june-07-2022-3192103', (game) => {
        expect(game.site).toBe('chess.com')
    }).then((data) => {
        expect(data).toBe(true)
    })
})

test('fetch individual game', async () => {
    expect.hasAssertions()
    await game('https://www.chess.com/game/live/45328864849').then((data) => {
        expect(data.site).toBe('chess.com')
    })
})

test('fetch individual game not found in the archives', async () => {
    await expect(() => game('https://www.chess.com/game/live/999')).rejects.toThrowError('Game not found in monthly archive')
})

describe('title is included with player info for games', () => {
    test('of player', async () => {
        expect.hasAssertions()

        await playerGames('imrosen', (game) => {
            expect([game.players.white.title, game.players.black.title]).toContain('IM')
        })
    })

    test('of tournament', async () => {
        let games: Array<Game> = []

        await tournamentGames('late-titled-tuesday-blitz-june-07-2022-3192103', (game) => {
            games.push(game)
        })

        expect(games[0].players.white.title).toBe('GM')
        expect(games[0].players.black.title).toBe('NM')
    })
})

test('not found', async () => {
    await expect(() => profile('user404')).rejects.toThrowError('404: Not Found')
    await expect(() => stats('user404')).rejects.toThrowError('404: Not Found')
    await expect(() => tournament('tournament404')).rejects.toThrowError('404: Not Found')

    await expect(() => archives('user404')).rejects.toThrowError('404: Not Found')
    await expect(() => playerGames('user404', () => {})).rejects.toThrowError('404: Not Found')

    await expect(() => tournamentGames('tournament404', () => {})).rejects.toThrowError('404: Not Found')
})

test('rate limited', async () => {
    await expect(() => profile('user429')).rejects.toThrowError('429: Too Many Requests')
    await expect(() => stats('user429')).rejects.toThrowError('429: Too Many Requests')
    await expect(() => tournament('tournament429')).rejects.toThrowError('429: Too Many Requests')

    await expect(() => archives('user429')).rejects.toThrowError('429: Too Many Requests')
    await expect(() => playerGames('user429', () => {})).rejects.toThrowError('429: Too Many Requests')

    await expect(() => tournamentGames('tournament429', () => {})).rejects.toThrowError('429: Too Many Requests')

    await expect(() => archive('https://api.chess.com/pub/player/user429/games/2022/05')).rejects.toThrowError(
        '429: Too Many Requests'
    )
})
