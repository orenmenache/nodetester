import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import * as dotenv from 'dotenv';
import { getTournamentsByCategory__FOOTBALL } from './functions/Football/002__getTournamentsByCategory';
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
        // await getTopPlayersByLeague(DB);
        /**
         * FOOTBALL
         */
        // await getCategories__FOOTBALL(DB);
        await getTournamentsByCategory__FOOTBALL(DB);
    } catch (e) {
        console.warn(`Failed to insert: ${e}`);
    } finally {
        await DB.pool.end();
    }
}

main();
