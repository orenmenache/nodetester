import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import * as dotenv from 'dotenv';
import { getTournamentsByCategory__FOOTBALL } from './functions/Football/002__getTournamentsByCategory';
import { getLeagueSeasonsByTournament__FOOTBALL } from './functions/Football/003__getLeagueSeasonsByTournament';
import axios, { AxiosResponse } from 'axios';
import { allSportsAPIURLs } from './config/allSportsAPIURLs';
import { AllSports__LeagueSeason } from './types/allSportsApi/Seasons';
import { getTeamsByTournamentAndSeason__FOOTBALL } from './functions/Football/004__getTeamsByTournamentAndSeason';
import { getPlayersByTeam__FOOTBALL } from './functions/Football/005a__getPlayersByTeam';
import { getLastMatches__FOOTBALL } from './functions/Football/006__getLastMatches';
import { getNextMatches__FOOTBALL } from './functions/Football/007__getNextMatches';
import { getNextMatches__CRICKET } from './functions/Cricket/007__getNextMatches';
import { getTournamentsByCategory__CRICKET } from './functions/Cricket/002__getTournamentsByCategory';
import { getLeagueSeasonsByTournament__CRICKET } from './functions/Cricket/003__getLeagueSeasonsByTournament';
import { getTeamsByTournamentAndSeason__CRICKET } from './functions/Cricket/004__getTeamsByTournamentAndSeason';
import { getLastMatches__CRICKET } from './functions/Cricket/006__getLastMatches';
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
        // await getLeagueSeasonsByTournament__CRICKET(DB);
        // await getTeamsByTournamentAndSeason__CRICKET(DB);
        // await getPlayersByTeam__FOOTBALL(DB);
        // await getLastMatches__FOOTBALL();
        // await getTournamentsByCategory__CRICKET(DB);
        // await getNextMatches__CRICKET(DB);
        await getLastMatches__CRICKET(DB);
    } catch (e) {
        console.warn(`Failed to insert: ${e}`);
    } finally {
        await DB.pool.end();
    }
}

main();
