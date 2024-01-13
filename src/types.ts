import { PgnMove } from '@mliebelt/pgn-types'

export type ChessSite = 'lichess' | 'chess.com'

export type FetchOptions = {
    headers?: {
        Accept?: 'application/json' | 'application/x-ndjson'
        Authorization?: string
    }
    signal?: AbortSignal
}

export type LichessGameParameters = {
    since?: number
    until?: number
    max?: number
    vs?: string
    rated?: boolean
    perfType?:
        | 'ultraBullet'
        | 'bullet'
        | 'blitz'
        | 'rapid'
        | 'classical'
        | 'correspondence'
        | 'chess960'
        | 'crazyhouse'
        | 'antichess'
        | 'atomic'
        | 'horde'
        | 'kingOfTheHill'
        | 'racingKings'
        | 'threeCheck'
    color?: ChessColor
    analysed?: boolean
    moves?: boolean
    pgnInJson?: boolean
    tags?: boolean
    clocks?: boolean
    evals?: boolean
    opening?: boolean
    ongoing?: boolean
    finished?: boolean
    literate?: boolean
    players?: string
    sort?: 'dateAsc' | 'dateDesc'
}

export type ChessColor = 'white' | 'black'

export type ChesscomGameParameters = {
    since?: number
    max?: number
}

export type GamePlayer = {
    username?: string
    title: Title
    rating?: number
}

export type ChessComGamePlayer = {
    rating: number
    result: string
    '@id': string
    username: string
    uuid: string
}

export type ChessComTournament = {
    name: string
    url: string
    creator: string
    status: string
    start_time: number
    finish_time: number
    settings: {
        type: string
        rules: string
        is_rated: boolean
        is_official: boolean
        is_invite_only: boolean
        user_advance_count: number
        winner_places: number
        registered_user_count: number
        total_rounds: number
        time_class: string
        time_control: string
    }
    players: Array<{
        username: string
        status: string
    }>
    rounds: string[]
}

export type ChessComArchives = {
    archives: string[]
}

export type ChessComArchive = {
    games: ChessComGame[]
}

export type ChessComGame = {
    url: string
    pgn: string
    time_control: string
    end_time: number
    rated: boolean
    accuracies: {
        white: number
        black: number
    }
    tcn: string
    uuid: string
    initial_setup: string
    fen: string
    time_class: string
    rules: string
    white: ChessComGamePlayer
    black: ChessComGamePlayer
    tournament: string
}

export type ChessComPlayer = {
    avatar: string
    player_id: number
    '@id': string
    url: string
    name: string
    username: string
    title: string
    followers: number
    country: string
    location: string
    last_online: number
    joined: number
    status: string
    is_streamer: boolean
    verified: boolean
}

type ChesscomPerfRating = {
    last: {
        rating: number
    }
    record: {
        win: number
        loss: number
        draw: number
    }
}

export type ChesscomStats = {
    chess_blitz?: ChesscomPerfRating
    chess_bullet?: ChesscomPerfRating
    chess_daily?: ChesscomPerfRating
    chess_rapid?: ChesscomPerfRating
    fide?: number
    lessons?: object
    puzzle_rush?: object
    tactics?: object
}

export type LichessSwiss = {
    id: string
    createdBy: string
    startsAt: string
    name: string
    clock: {
        limit: number
        increment: number
    }
    variant: string
    round: number
    nbRounds: number
    nbPlayers: number
    nbOngoing: number
    status: string
    stats: {
        games: number
        whiteWins: number
        blackWins: number
        draws: number
        byes: number
        absences: number
        averageRating: number
    }
    rated: boolean
}

export type LichessArena = {
    nbPlayers: number
    duels: Array<{
        id: string
        p: Array<{
            n: string
            r: number
            k: number
        }>
    }>
    isFinished: boolean
    podium: Array<{}>
    pairingsClosed: boolean
    stats: {
        games: number
        moves: number
        whiteWins: number
        blackWins: number
        draws: number
        berserks: number
        averageRating: number
    }
    standing: {
        page: number
        players: Array<{}>
    }
    id: string
    createdBy: string
    startsAt: string
    system: string
    fullName: string
    minutes: number
    perf: {
        key: string
        name: string
        icon: string
    }
    clock: {
        limit: number
        increment: number
    }
    variant: string
    rated: boolean
    berserkable: boolean
    verdicts: {
        list: Array<{}>
        accepted: boolean
    }
    schedule: {
        freq: string
        speed: string
    }
}

export type LichessPlayer = {
    id: string
    username: string
    disabled: boolean
    tosViolation: boolean
    perfs: {
        bullet: {
            games: number
            rating: number
            rd: number
            prog: number
        }
        blitz: {
            games: number
            rating: number
            rd: number
            prog: number
        }
        rapid: {
            games: number
            rating: number
            rd: number
            prog: number
        }
    }
    title: string
    patron: boolean
    createdAt: number
    online: boolean
    profile: {
        bio: string
        firstName: string
        lastName: string
        links: string
        country: string
        location: string
    }
    seenAt: number
    playTime: {
        total: number
        tv: number
    }
    url: string
    count?: {
        all: number
    }
    followable: boolean
    following: boolean
    blocking: boolean
    followsYou: boolean
}

export type LichessTimeControl = {
    initial: number
    increment: number
    totalTime: number
}

type LichessGameUser = {
    user?: {
        name: string
        title?: Title
        patron?: boolean
        id: string
    }
    rating?: number
    ratingDiff?: number
    provisional?: boolean
    analysis?: {
        inaccuracy: number
        mistake: number
        blunder: number
        acpl: number
    }
    aiLevel?: number
}

type Analysis = {
    eval?: number
    mate?: number
    best?: string
    variation?: string
    judgment?: {
        name: string
        comment: string
    }
}

export type LichessGame = {
    id: string
    rated: boolean
    variant: string
    speed: string
    perf: string
    createdAt: number
    lastMoveAt: number
    status: string
    players: {
        white: LichessGameUser
        black: LichessGameUser
    }
    winner: ChessColor
    moves: string
    opening?: {
        eco: string
        name: string
        ply: number
    }
    pgn?: string
    clocks?: number[]
    initialFen?: string
    clock: LichessTimeControl
    analysis?: Analysis[]
}

export type Title = 'CM' | 'FM' | 'GM' | 'IM' | 'NM' | 'WCM' | 'WFM' | 'WGM' | 'WIM' | 'WNM' | 'BOT' | null

export type TitledPlayers = { [key: string]: Title }

export type TournamentType = 'arena' | 'swiss'

interface BaseObject {
    site: ChessSite
    type: 'profile' | 'game' | TournamentType
}

export interface Tournament extends BaseObject {
    id: string
    url: string
    name: string
    timeControl: TimeControl
    isFinished: boolean
    playerCount: number
    stats?: {
        games: number
    }
}

export interface Game extends BaseObject {
    id: string
    links: {
        white: string
        black: string
    }

    timestamp: number
    lastMoveAt?: number
    isStandard: boolean

    result: Result

    players: {
        white: GamePlayer
        black: GamePlayer
    }

    timeControl: TimeControl
    opening: {
        eco: string
        name: string
    }
    moves: PgnMove[]
    clocks: number[]
    analysis?: Analysis[]
}

export type GameCallback = (game: Game) => void

export interface TimeControl {
    initial?: number
    increment?: number
    correspondence?: number
}

export interface Result {
    winner?: ChessColor
    outcome?: 'draw'
    via?:
        | 'agreement'
        | 'insufficient'
        | 'repetition'
        | 'stalemate'
        | 'checkmate'
        | 'resignation'
        | 'timeout'
        | 'abandonment'
        | 'noStart' // Did not make a move
        | 'cheat' // Ended by cheat detection
        | '50moves'
        | 'variant' // For example, threecheck or bughousepartnerlose
    label: GameResultString
}

export type GameResultString = '1-0' | '0-1' | '½-½' | '*'

export interface Profile extends BaseObject {
    link: string
    username: string
    title?: string
    createdAt?: number
    lastSeenAt?: number
    name?: string
    location?: string

    ratings?: {
        bullet: Rating
        blitz: Rating
        rapid: Rating
    }

    counts?: {
        all?: number
    }

    disabled?: boolean
    marked?: boolean
}

type Rating = {
    rating: number
    games: number
}
