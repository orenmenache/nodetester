import { MYSQL_DB } from '../classes/MYSQL_DB/MYSQL_DB';
import { getCategories__CRICKET } from '../functions/Cricket/001__getCategories';
import { getLeagueSeasonsByTournament__CRICKET } from '../functions/Cricket/003__getLeagueSeasonsByTournament';
import { getTeamsByTournamentAndSeason__CRICKET } from '../functions/Cricket/004__getTeamsByTournamentAndSeason';
import { getLastMatches__CRICKET } from '../functions/Cricket/006__getLastMatches';
import { getNextMatches__CRICKET } from '../functions/Cricket/007__getNextMatches';

export type DB_NAME =
    | 'Football'
    | 'config'
    | 'Cricket'
    | 'Tennis'
    | 'Motorsport'
    | 'Basketball';

export const DB_NAMES: { [key in DB_NAME]: DB_NAME } = {
    config: 'config',
    Football: 'Football',
    Cricket: 'Cricket',
    Tennis: 'Tennis',
    Motorsport: 'Motorsport',
    Basketball: 'Basketball',
};

export const TABLES: {
    [key: string]: {
        name: string;
        createStatementSqlPath: string | null;
        dataPopulationFunction?: (DB: MYSQL_DB) => Promise<boolean>;
    };
} = {
    admins: {
        name: `${DB_NAMES.config}.admins`,
        createStatementSqlPath: null,
    },
    cricketStandings: {
        name: `${DB_NAMES.Cricket}.STANDINGS`,
        createStatementSqlPath: null,
    },
    cricketCategories: {
        name: `${DB_NAMES.Cricket}.CORE__CATEGORIES`,
        createStatementSqlPath: './sql/Cricket/002__createCategories.sql',
    },
    cricketTournaments: {
        name: `${DB_NAMES.Cricket}.CORE__TOURNAMENTS`,
        createStatementSqlPath: './sql/Cricket/003__createTournaments.sql',
    },
    cricketLeagueSeasons: {
        name: `${DB_NAMES.Cricket}.CORE__LEAGUESEASONS`,
        createStatementSqlPath: './sql/Cricket/004__createLeagueSeasons.sql', //`C:/Users/User/Documents/programming/NewsFactory/vicki/nodetester/sql/Cricket/004__createLeagueSeasons.sql`
        dataPopulationFunction: (DB: MYSQL_DB) =>
            getLeagueSeasonsByTournament__CRICKET(DB),
    },

    //cricketTopPlayers: { name: `${DB_NAMES.Cricket}.CORE__TOPPLAYERS`, createStatementSqlPath: null }, // comes from leagues
    //cricketPlayers: { name: `${DB_NAMES.Cricket}.CORE__PLAYERS`, createStatementSqlPath: null }, // comes from teams
    //cricketStatistics: { name: `${DB_NAMES.Cricket}.CORE__STATISTICS`, createStatementSqlPath: null },
    cricketTeams: {
        name: `${DB_NAMES.Cricket}.CORE__TEAMS`,
        createStatementSqlPath: './sql/Cricket/005__createTeams.sql',
        dataPopulationFunction: (DB: MYSQL_DB) =>
            getTeamsByTournamentAndSeason__CRICKET(DB),
    },
    cricketNextMatches: {
        name: `${DB_NAMES.Cricket}.RAPID__NEXTMATCHES`,
        createStatementSqlPath: './sql/Cricket/008__createNextMatches.sql',
        //dataPopulationFunction: (DB: MYSQL_DB) => getNextMatches__CRICKET(DB),
    },
    cricketLastMatches: {
        name: `${DB_NAMES.Cricket}.RAPID__LASTMATCHES`,
        createStatementSqlPath: './sql/Cricket/007__createLastMatches.sql',
        dataPopulationFunction: (DB: MYSQL_DB) => getLastMatches__CRICKET(DB),
    },
    footballStandings: {
        name: `${DB_NAMES.Football}.STANDINGS`,
        createStatementSqlPath: null,
    },
    footballCategories: {
        name: `${DB_NAMES.Football}.CORE__CATEGORIES`,
        createStatementSqlPath: null,
    },
    footballTournaments: {
        name: `${DB_NAMES.Football}.CORE__TOURNAMENTS`,
        createStatementSqlPath: null,
    },
    footballLeagueSeasons: {
        name: `${DB_NAMES.Football}.CORE__LEAGUESEASONS`,
        createStatementSqlPath: null,
    },
    footballTopPlayers: {
        name: `${DB_NAMES.Football}.CORE__TOPPLAYERS`,
        createStatementSqlPath: null,
    }, // comes from leagues
    footballPlayers: {
        name: `${DB_NAMES.Football}.CORE__PLAYERS`,
        createStatementSqlPath: null,
    }, // comes from teams
    footballStatistics: {
        name: `${DB_NAMES.Football}.CORE__STATISTICS`,
        createStatementSqlPath: null,
    },
    footballTeams: {
        name: `${DB_NAMES.Football}.CORE__TEAMS`,
        createStatementSqlPath: null,
    },
    footballLastMatches: {
        name: `${DB_NAMES.Football}.RAPID__LASTMATCHES`,
        createStatementSqlPath: null,
    },
    footballNextMatches: {
        name: `${DB_NAMES.Football}.RAPID__NEXTMATCHES`,
        createStatementSqlPath: null,
    },
    tennisCategories: {
        name: `${DB_NAMES.Tennis}.CORE__CATEGORIES`,
        createStatementSqlPath: null,
    },
    tennisTournaments: {
        name: `${DB_NAMES.Tennis}.CORE__TOURNAMENTS`,
        createStatementSqlPath: null,
    },
    tennisLeagueSeasons: {
        name: `${DB_NAMES.Tennis}.CORE__LEAGUESEASONS`,
        createStatementSqlPath: null,
    },
    motorsportCategories: {
        name: `${DB_NAMES.Motorsport}.CORE__CATEGORIES`,
        createStatementSqlPath: null,
    },
    motorsportStages: {
        name: `${DB_NAMES.Motorsport}.CORE__STAGES`,
        createStatementSqlPath: null,
    },
    motorsportSeasons: {
        name: `${DB_NAMES.Motorsport}.CORE__SEASONS`,
        createStatementSqlPath: null,
    },
    basketballCategories: {
        name: `${DB_NAMES.Basketball}.CORE__CATEGORIES`,
        createStatementSqlPath: null,
    },
    basketballTournaments: {
        name: `${DB_NAMES.Basketball}.CORE__TOURNAMENTS`,
        createStatementSqlPath: null,
    },
    basketballLeagueSeasons: {
        name: `${DB_NAMES.Basketball}.CORE__LEAGUESEASONS`,
        createStatementSqlPath: null,
    },
    basketballTeams: {
        name: `${DB_NAMES.Basketball}.CORE__TEAMS`,
        createStatementSqlPath: null,
    },
};
