# Chess API Client

An API client for fetching data from Lichess and Chess.com.

Pass in Lichess or Chess.com URLs to the same function and get data back from either site in the exact same format.

Intended use is for apps that want to offer game analysis using data from both sites, but don't want to maintain separate code for each.

## Usage

```js
/*
 * Fetch a player's profile (public info, rating, game stats)
 *
 * Accepts Lichess and Chess.com URLs:
 * https://lichess.org/@/DrNykterstein
 * https://chess.com/member/magnuscarlsen
 */
player('https://lichess.org/@/DrNykterstein').then((player) => {
    console.log(player)
})

/*
 * Fetch tournament info/stats
 *
 * Accepts Lichess and Chess.com URLs for arena or Swiss tournaments:
 * Lichess arena:   https://lichess.org/tournament/may22lta
 * Lichess Swiss:   https://lichess.org/swiss/48jrx3m6
 * Chess.com arena: https://www.chess.com/tournament/live/arena/100-rapid-1937387
 * Chess.com Swiss: https://www.chess.com/tournament/live/late-titled-tuesday-blitz-june-07-2022-3192103
 */
tournament('https://lichess.org/tournament/may22lta').then((tournament) => {
    console.log(tournament)
})

/*
 * Fetch games of a player or tournament
 *
 * Accepts URLs for players or tournaments from Lichess or Chess.com
 * Any of the above example links will download the games for that player or tournament.
 */
games('https://lichess.org/@/DrNykterstein', 'lichess', (game) => {
    console.log(`${game.players.white.username} vs ${game.players.black.username}`, game.result.label)
}).then(() => console.log('done'))
```

## Installation

```bash
npm install @rosen-score/chess-fetcher # not published yet
```

## Development

```bash
git clone https://github.com/rosen-score/chess-fetcher.git
cd chess-fetcher
npm install
```

```bash
# Run the test suite
npm run test
```

### Check with SonarQube

```bash
docker-compose -f docker-compose.sonar.yml up -d
```

That starts the SonarQube dashboard at http://localhost:9000/ (login: admin/admin)

```bash
npx ts-node sonar-project.ts
```
