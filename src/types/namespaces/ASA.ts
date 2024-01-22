import { AxiosResponse } from 'axios';

export namespace ASA {
    namespace Internal {
        export type RoundInfo = {
            round: string;
        };

        export type Status = {
            code: string;
            description: string;
            type: string;
        };

        export type Score = {
            current: string;
            display: string;
            period1: string;
            period2: string;
            normaltime: string;
        };

        export type Time = {
            injuryTime1: string;
            injuryTime2: string;
            currentPeriodStartTimestamp: string;
        };

        export type Changes = {
            changes: string[];
            changeTimestamp: string;
        };
    }

    export type TeamBase = {
        id: string;
        name: string;
        slug: string;
        type?: string;
    };

    export type Team = TeamBase & {
        shortName: string;
        nameCode: string;
    };

    export type TeamStandingsBase = {
        team: Team;
        position: number;
        matches: number;
        wins: number;
        id: number;
        losses: number;
        points: number;
    };

    export type CategoryBase = {
        id: string;
        name: string;
        slug: string;
        priority?: string;
        flag?: string;
        alpha2?: string;
    };

    export type Category = CategoryBase & {
        sport: {
            id: string;
            name: string;
            slug: string;
        };
    };

    export type TournamentBase = {
        id: string;
        name: string;
        slug: string;
    };

    export type Tournament = TournamentBase & {
        category: Category;
    };

    export type LeagueSeason = {
        id: string;
        name: string;
        year: string;
    };

    export type Player = {
        id: string;
        name: string;
        slug: string;
        shortName: string;
        position: string;
        userCount: string;
    };
    export namespace Football {
        export namespace Responses {
            export type TeamPlayers = AxiosResponse<{
                players: { player: Player }[];
                foreignPlayers: { player: Player }[];
                nationalPlayers: { player: Player }[];
            }>;
            export type Standings = AxiosResponse<{
                standings: { rows: ASA.Football.Standings[] }[];
            }>;
        }

        export type Standings = ASA.TeamStandingsBase & {
            draws: number;
            scoresFor: number;
            scoresAgainst: number;
        };

        export type LastMatch = {
            tournament: { uniqueTournament: Tournament };
            roundInfo: Internal.RoundInfo;
            customId: string;
            status: Internal.Status;
            winnerCode: string;
            homeTeam: Team;
            awayTeam: Team;
            homeScore: Internal.Score;
            awayScore: Internal.Score;
            time: Internal.Time;
            changes: Internal.Changes;
            hasGlobalHighlights: boolean;
            hasXg: boolean;
            hasEventPlayerStatistics: boolean;
            hasEventPlayerHeatMap: boolean;
            detailId: string;
            crowdsourcingDataDisplayEnabled: boolean;
            id: string;
            crowdsourcingEnabled: boolean;
            startTimestamp: string;
            slug: string;
            finalResultOnly: boolean;
            isEditor: boolean;
        };

        export type NextMatch = {
            tournament: { uniqueTournament: Tournament };
            customId: string;
            status: Internal.Status;
            winnerCode: string;
            homeTeam: Team;
            awayTeam: Team;
            homeScore: Internal.Score;
            awayScore: Internal.Score;
            time: Internal.Time;
            changes: Internal.Changes;
            hasGlobalHighlights: boolean;
            hasXg: boolean;
            hasEventPlayerStatistics: boolean;
            hasEventPlayerHeatMap: boolean;
            detailId: string;
            crowdsourcingDataDisplayEnabled: boolean;
            id: string;
            crowdsourcingEnabled: boolean;
            startTimestamp: string;
            slug: string;
            finalResultOnly: boolean;
            isEditor: boolean;
        };
    }

    export namespace Cricket {
        export namespace Responses {
            export type Standings = AxiosResponse<{
                standings: { rows: ASA.Cricket.Standings[] }[];
            }>;
        }

        export type Standings = ASA.TeamStandingsBase & {
            draws: number;
        };
    }

    export namespace Tennis {
        export namespace Responses {
            export type Standings = AxiosResponse<{
                standings: { rows: TeamStandingsBase[] }[];
            }>;
        }
    }

    export namespace Basketball {
        export namespace Responses {
            export type Standings = AxiosResponse<{
                standings: { rows: ASA.Basketball.Standings[] }[];
            }>;
        }

        export type Standings = Omit<
            ASA.TeamStandingsBase,
            'points' | 'matches'
        > & {
            streak: number;
            percentage: number;
        };
    }

    export namespace Motorsport {
        export type SeasonBase = {
            description: string;
            id: string;
            name: string;
            slug: string;
            year: string;
        };

        export type Season = SeasonBase & {
            startDateTimestamp: string;
            endDateTimestamp: string;
        };
    }
}
