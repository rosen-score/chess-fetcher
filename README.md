## How to release a new version

    npm version 0.x.x
    git push origin main --tags

Github workflow will auto publish it to npm.

## Linking as a local package

    cd chess-fetcher
    npm link
    cd ../rosen-score
    npm uninstall chess-fetcher
    npm link chess-fetcher

After making any changes to `chess-fetcher`, run `npm run build` to update the symlink'ed code for `rosen-score`.
