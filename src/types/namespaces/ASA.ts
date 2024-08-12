import { AxiosResponse } from 'axios';

export namespace ASA {
    export type MatchBase = {
        id: string;
        name: string;
        slug: string;
        type: string;
        awayScore: Internal.ScoreBase;
        homeScore: Internal.ScoreBase;
        status: string;
        winnerCode: number; // 0 = draw, 1 = home, 2 = away
        startTimestamp: number;
        homeTeam: Team;
        awayTeam: Team;
    };

    export type NextMatch = MatchBase;

    export type LastMatch = MatchBase;

    namespace Internal {
        export type RoundInfo = {
            round: string;
        };

        export type Status = {
            code: string;
            description: string;
            type: string;
        };

        export type ScoreBase = {
            current: string;
            display: string;
            // period1: string;
            // period2: string;
            // normaltime: string;
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
        tournament: {
            [key: string]: string;
        };
        position: string;
        matches?: string;
        wins?: string;
        draws?: string;
        losses?: string;
        points?: string;

        scoresFor?: string;
        scoresAgainst?: string;
        percentage?: string;
        streak?: string;
        netRunRate?: string;
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

    export type Country = {
        alpha2: string;
        alpha3: string;
        name: string;
    };

    export type Player = {
        name: string;
        slug: string;
        shortName: string;
        team: {
            position: string;
            jerseyNumber: string;
        };
        height: string;
        retired: boolean;
        userCount: string;
        deceased: boolean;
        position: string;
        gender: string;
        id: string;
        country: Country;
        shirtNumber: string;
        jerseyNumber: string;
        dateOfBirthTimestamp: string;
    };

    export type PlayerStatistics = {
        id: string;
        fumbleRecovery?: string;
        fumbleSafety?: string;
        fumbleTouchdownReturns?: string;
        fumbleFumblesTouchback?: string;
        kickingTotalPoints?: string;
        passingTouchdownPercentage?: string;
        passingInterceptionPercentage?: string;
        passingTwentyPlus?: string;
        passingFortyPlus?: string;
        passingYardsLostPerSack?: string;
        passingFirstDownPercentage?: string;
        passingYardsPerGame?: string;
        passingTouchdownInterceptionRatio?: string;

        kickingExtraAttempts?: string;
        kickingExtraMade?: string;
        kickingExtraPercentage?: string;
        kickingFgAttempts?: string;
        kickingFgAttempts20to29?: string;
        kickingFgAttempts30to39?: string;
        kickingFgAttempts40to49?: string;
        kickingFgAttempts50plus?: string;
        kickingFgBlocked?: string;
        kickingFgLong?: string;
        kickingFgMade?: string;
        kickingFgMade20to29?: string;
        puntReturnsLong?: string;
        puntReturnsTotal?: string;
        puntReturnsTouchdowns?: string;
        puntReturnsYards?: string;
        puntReturnsFairCatches?: string;
        puntReturnsLgtd?: string;
        kickReturnsAverageYards?: string;
        kickReturnsLong?: string;
        kickReturnsTotal?: string;
        kickReturnsTouchdowns?: string;
        kickReturnsYards?: string;
        kickReturnsFairCatches?: string;
        kickReturnsLgtd?: string;
        passingAttempts?: string;
        passingCompletionPercentage?: string;
        passingCompletions?: string;
        passingInterceptions?: string;
        passingLongest?: string;
        passingNetYards?: string;
        passingSacked?: string;
        passingTouchdowns?: string;
        passingYards?: string;
        passingYardsPerAttempt?: string;
        passingLongTouchdown?: string;
        passingSackedYardsLost?: string;
        passingFirstDowns?: string;
        passingPasserRating?: string;
        receivingFirstDowns?: string;
        receivingLongest?: string;
        receivingReceptions?: string;
        receivingTouchdowns?: string;
        receivingYards?: string;
        receivingYardsPerReception?: string;
        receivingTargets?: string;
        receivingLongTouchdowns?: string;
        rushingAttempts?: string;
        rushingLongest?: string;
        rushingTouchdowns?: string;
        rushingYards?: string;
        rushingYardsPerAttempt?: string;
        rushingFirstDowns?: string;
        rushingLongTouchdown?: string;
        fumbleFumbles?: string;
        fumbleLost?: string;
        fumbleOpponentFumbleRecovery?: string;
        fumbleTeammateFumbleRecovery?: string;
        fumbleFumblesOutbounds?: string;
        fumbleTeammateFumbleYards?: string;
        fumbleTeammateFumbleTd?: string;
        fumbleOpponentFumbleYards?: string;
        fumbleOpponentFumbleTd?: string;
        defensiveAssistTackles?: string;
        defensiveCombineTackles?: string;
        defensiveForcedFumbles?: string;
        defensiveInterceptions?: string;
        defensivePassesDefensed?: string;
        defensiveSacks?: string;
        defensiveSafeties?: string;
        defensiveTotalTackles?: string;
        puntingBlocked?: string;
        puntingInside20?: string;
        puntingLongest?: string;
        puntingNetYards?: string;
        puntingTotal?: string;
        puntingTouchbacks?: string;
        puntingYards?: string;
        puntingYardsPerPuntAvg?: string;
        puntsNetYardsPerPuntAvg?: string;
        puntingReturnYards?: string;

        type?: string;
        appearances?: string;
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
            export type NextMatches = AxiosResponse<{
                events: ASA.Football.NextMatch[];
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
            homeScore: Internal.ScoreBase;
            awayScore: Internal.ScoreBase;
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
            homeScore: Internal.ScoreBase;
            awayScore: Internal.ScoreBase;
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
            export type NextMatches = AxiosResponse<{
                events: ASA.Cricket.NextMatch[];
            }>;
            export type LastMatches = AxiosResponse<{
                events: ASA.Cricket.LastMatch[];
            }>;
        }

        export type Standings = ASA.TeamStandingsBase & {
            draws: number;
        };

        export type NextMatch = ASA.NextMatch;
        export type LastMatch = ASA.LastMatch;
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

    export namespace AmericanFootball {
        export type Score = {
            current: string;
            display: string;
            period1: string;
            period2: string;
            period3: string;
            period4: string;
            normaltime: string;
        };

        export type Match = {
            winnerCode: string;
            id: string;
            startTimestamp: string;
            slug: string;
            finalResultOnly: string;
            tournament: {};
            season: {};
            roundInfo: {
                round: string;
            };
            status: {
                code: string;
                description: string;
                type: string;
            };
            homeTeam: {
                id: string;
            };
            awayTeam: {
                id: string;
            };
            homeScore: Score;
            awayScore: Score;
            time: {
                played: string;
                periodLength: string;
                overtimeLength: string;
                totalPeriodCount: string;
                currentPeriodTimestamp: string;
            };
            changes: {};
            periods: {
                current: string;
                period1: string;
                period2: string;
                period3: string;
                period4: string;
                overtime: string;
            };
            homeTeamSeasonHistoricalForm: {
                wins: string;
                losses: string;
            };
            awayTeamSeasonHistoricalForm: {
                wins: string;
                losses: string;
            };
        };
    }
}
