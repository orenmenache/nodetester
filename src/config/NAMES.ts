export type DB_NAME = 'Football' | 'config' | 'Cricket';

export const DB_NAMES: { [key in DB_NAME]: DB_NAME } = {
    config: 'config',
    Football: 'Football',
    Cricket: 'Cricket',
};

export const TABLE_NAMES: { [key: string]: string } = {
    admins: `${DB_NAMES.config}.admins`,
    cricketStandings: `${DB_NAMES.Cricket}.STANDINGS`,
    cricketCategories: `${DB_NAMES.Cricket}.CORE__CATEGORIES`,
    cricketTournaments: `${DB_NAMES.Cricket}.CORE__TOURNAMENTS`,
    cricketLeagueSeasons: `${DB_NAMES.Cricket}.CORE__LEAGUESEASONS`,
    cricketTopPlayers: `${DB_NAMES.Cricket}.CORE__TOPPLAYERS`, // comes from leagues
    cricketPlayers: `${DB_NAMES.Cricket}.CORE__PLAYERS`, // comes from teams
    cricketStatistics: `${DB_NAMES.Cricket}.CORE__STATISTICS`,
    cricketTeams: `${DB_NAMES.Cricket}.CORE__TEAMS`,
    footballStandings: `${DB_NAMES.Football}.STANDINGS`,
    footballCategories: `${DB_NAMES.Football}.CORE__CATEGORIES`,
    footballTournaments: `${DB_NAMES.Football}.CORE__TOURNAMENTS`,
    footballLeagueSeasons: `${DB_NAMES.Football}.CORE__LEAGUESEASONS`,
    footballTopPlayers: `${DB_NAMES.Football}.CORE__TOPPLAYERS`, // comes from leagues
    footballPlayers: `${DB_NAMES.Football}.CORE__PLAYERS`, // comes from teams
    footballStatistics: `${DB_NAMES.Football}.CORE__STATISTICS`,
    footballTeams: `${DB_NAMES.Football}.CORE__TEAMS`,
    footballLastMatches: `${DB_NAMES.Football}.RAPID__LASTMATCHES`,
    footballNextMatches: `${DB_NAMES.Football}.RAPID__NEXTMATCHES`,
};
