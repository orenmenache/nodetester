import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import * as dotenv from 'dotenv';
import { getTournamentsByCategory__FOOTBALL } from './functions/Football/002__getTournamentsByCategory';
import { getLeagueSeasonsByTournament__FOOTBALL } from './functions/Football/003__getLeagueSeasonsByTournament';
import axios, { AxiosResponse } from 'axios';
import { allSportsAPIURLs } from './config/allSportsAPIURLs';
import { AllSports__LeagueSeason } from './types/allSportsApi/Seasons';
import { getTeamsByTournamentAndSeason__FOOTBALL } from './functions/Football/004__getTeamsByTournamentAndSeason';
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
        // await getTournamentsByCategory__FOOTBALL(DB);
        // await getLeagueSeasonsByTournament__FOOTBALL(DB);
        await getTeamsByTournamentAndSeason__FOOTBALL(DB);
    } catch (e) {
        console.warn(`Failed to insert: ${e}`);
    } finally {
        await DB.pool.end();
    }
}

main();
