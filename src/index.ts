import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import { getCategories } from './functions/001__getCategories';
import { getTournamentsByCategory } from './functions/002__getTournamentsByCategory';
import * as dotenv from 'dotenv';
import { getLeagueSeasonsByTournament } from './functions/003__getLeagueSeasonsByTournament';
dotenv.config();

async function main() {
    const DB = new MYSQL_DB();
    DB.createPool();
    try {
        // await getCategories(DB);
        // await getTournamentsByCategory(DB);
        await getLeagueSeasonsByTournament(DB);
    } catch (e) {
        console.warn(`Failed to insert: ${e}`);
    } finally {
        await DB.pool.end();
    }
}

main();
