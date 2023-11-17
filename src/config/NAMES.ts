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
    cricketTopPlayers: `${DB_NAMES.Cricket}.CORE__TOPPLAYERS`,
};
