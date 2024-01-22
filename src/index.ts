import * as dotenv from 'dotenv';
import { HIT } from './HIT';
import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import { getCategories__TENNIS } from './functions/Tennis/001__getCategories';
import { getTournamentsByCategory__TENNIS } from './functions/Tennis/002__getTournamentsByCategory';
import { getCategories__BASKETBALL } from './functions/Basketball/001__getCategories';
import { get } from 'http';
import { getTournamentsByCategory__BASKETBALL } from './functions/Basketball/002__getTournamentsByCategory';
import { getCategories__MOTORSPORT } from './functions/Motorsport/001__getCategories';
import { getStagesByCategory__MOTORSPORT } from './functions/Motorsport/002__getStagesByCategory';
import { getSeasonsByStage__MOTORSPORT } from './functions/Motorsport/003__getSeasonsByStage';
import { getLeagueSeasonsByTournament__BASKETBALL } from './functions/Basketball/003__getLeagueSeasonsByTournament';
import { getLeagueSeasonsByTournament__TENNIS } from './functions/Tennis/003__getLeagueSeasonsByTournament';
import { getCategories__CRICKET } from './functions/Cricket/001__getCategories';
import { getTournamentsByCategory__CRICKET } from './functions/Cricket/002__getTournamentsByCategory';
import { getLeagueSeasonsByTournament__CRICKET } from './functions/Cricket/003__getLeagueSeasonsByTournament';
import { getLeagueSeasonsByTournament__FOOTBALL } from './functions/Football/003__getLeagueSeasonsByTournament';
import { getNextMatches__FOOTBALL } from './functions/Football/007__getNextMatches';
import { getNextMatches__CRICKET } from './functions/Cricket/007__getNextMatches';
import { getNextMatches__BASKETBALL } from './functions/Basketball/007__getNextMatches';
import { getNextMatches__TENNIS } from './functions/Tennis/007__getNextMatches';
import getStandings__FOOTBALL from './functions/Football/009__getStandings';
import getStandings__CRICKET from './functions/Cricket/009__getStandings';
import getStandings__TENNIS from './functions/Tennis/009__getStandings';
dotenv.config();

async function main() {
    const DB = new MYSQL_DB('Football');
    DB.createPool();

    try {
        //await getCategories__TENNIS(DB);
        //await getTournamentsByCategory__TENNIS(DB);

        // await getCategories__BASKETBALL(DB);
        // await getTournamentsByCategory__BASKETBALL(DB);

        // await getCategories__MOTORSPORT(DB);
        // await getStagesByCategory__MOTORSPORT(DB);
        // await getSeasonsByStage__MOTORSPORT(DB);

        //await getLeagueSeasonsByTournament__TENNIS(DB);
        // await getTournamentsByCategory__CRICKET(DB);
        await getStandings__TENNIS(DB);

        // const leagueSeasonsTableName = 'CORE__LEAGESEASONS';
        // const relevantS
    } catch (e) {
        console.log(e);
    } finally {
        await DB.pool.end();
    }
    // await HIT.categories();
}

main();
