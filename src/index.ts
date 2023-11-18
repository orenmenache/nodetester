import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import { getCategories } from './functions/001__getCategories';
import { getTournamentsByCategory } from './functions/002__getTournamentsByCategory';
import * as dotenv from 'dotenv';
import { getLeagueSeasonsByTournament } from './functions/003__getLeagueSeasonsByTournament';
import { getTeamsByTournamentAndSeason } from './functions/004__getTeamsByTournamentAndSeason';
import { getPlayersByTeam } from './functions/005a__getPlayersByTeam';
import { getTopPlayersByLeague } from './functions/005b__getTopPlayersByLeague';
dotenv.config();

async function main() {
    const DB = new MYSQL_DB();
    DB.createPool();
    try {
        // await getCategories(DB);
        // await getTournamentsByCategory(DB);
        // await getLeagueSeasonsByTournament(DB);
        /**
         * 249 leagues with standings
         * When we filter leagueSeasons from 2023 and above
         * there are 112 leagueSeasons with standings
         */
        // await getTeamsByTournamentAndSeason(DB);
        // await getPlayersByTeam(DB);
        await getTopPlayersByLeague(DB);
    } catch (e) {
        console.warn(`Failed to insert: ${e}`);
    } finally {
        await DB.pool.end();
    }
}

main();
