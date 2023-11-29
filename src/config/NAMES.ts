export type DB_NAME = 'Football' | 'config' | 'Cricket';

export const DB_NAMES: { [key in DB_NAME]: DB_NAME } = {
    config: 'config',
    Football: 'Football',
    Cricket: 'Cricket',
};

export const TABLE_NAMES: {
    [key: string]: { name: string; createStatementSqlPath: string | null };
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
        createStatementSqlPath: '../sql/Cricket/002__createCategories.sql',
    },
    cricketTournaments: {
        name: `${DB_NAMES.Cricket}.CORE__TOURNAMENTS`,
        createStatementSqlPath: '../sql/Cricket/002__createTournaments.sql',
    },
    cricketLeagueSeasons: {
        name: `${DB_NAMES.Cricket}.CORE__LEAGUESEASONS`,
        createStatementSqlPath: '../sql/Cricket/002__createLeagueSeasons.sql',
    },
    //cricketTopPlayers: { name: `${DB_NAMES.Cricket}.CORE__TOPPLAYERS`, createStatementSqlPath: null }, // comes from leagues
    //cricketPlayers: { name: `${DB_NAMES.Cricket}.CORE__PLAYERS`, createStatementSqlPath: null }, // comes from teams
    //cricketStatistics: { name: `${DB_NAMES.Cricket}.CORE__STATISTICS`, createStatementSqlPath: null },
    cricketTeams: {
        name: `${DB_NAMES.Cricket}.CORE__TEAMS`,
        createStatementSqlPath: null,
    },
    cricketNextMatches: {
        name: `${DB_NAMES.Cricket}.RAPID__NEXTMATCHES`,
        createStatementSqlPath: null,
    },
    cricketLastMatches: {
        name: `${DB_NAMES.Cricket}.RAPID__LASTMATCHES`,
        createStatementSqlPath: null,
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
};
