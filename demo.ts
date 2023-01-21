import { player, tournament, games, game, info } from './src/api'

// Fetch a player's profile (public info, rating, game stats)
player('https://lichess.org/@/EricRosen').then((player) => {
    console.log(player)
})

// Fetch tournament info/stats
tournament('https://lichess.org/tournament/may22lta').then((tournament) => {
    console.log(tournament)
})

// When you're not sure if a URL is a player or tournament
info('https://lichess.org/@/EricRosen').then((info) => {
    console.log(info.type, info)
})

// Fetch an individual game
game('https://lichess.org/fBcFhVs4').then((game) => {
    console.log(game)
})

// Fetch games of a player or tournament
games('https://lichess.org/@/EricRosen', (game) => {
    console.log(`${game.players.white.username} vs ${game.players.black.username}`, game.result.label)
}).then(() => console.log('done'))
