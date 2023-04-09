# Chess Fetcher

Typescript library for fetching chess games. Handles fetching and ndjson parsing. Returns data in a standard format.

## Installation

```bash
npm install chess-fetcher
```

## Usage

```javascript
// Fetch a player's profile (public info, rating, game stats)
player('https://lichess.org/@/DrNykterstein').then((player) => {
    console.log(player)
})

// Fetch games of a player or tournament
games('https://lichess.org/@/DrNykterstein', (game) => {
    console.log(`${game.players.white.username} vs ${game.players.black.username}`, game.result.label)
}).then(() => console.log('done'))
```

## Development Notes

### How to release a new version

    npm version 0.x.x
    git push origin main --tags

Github workflow will auto publish it to npm.

### Linking as a local package

    cd chess-fetcher
    npm link
    cd ../rosen-score
    npm uninstall chess-fetcher
    npm link chess-fetcher

After making any changes to `chess-fetcher`, run `npm run build` to update the symlink'ed code for `rosen-score`.
