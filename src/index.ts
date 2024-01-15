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
dotenv.config();

async function main() {
    const DB = new MYSQL_DB('Tennis');
    DB.createPool();

    try {
        //await getCategories__TENNIS(DB);
        //await getTournamentsByCategory__TENNIS(DB);

        // await getCategories__BASKETBALL(DB);
        // await getTournamentsByCategory__BASKETBALL(DB);

        // await getCategories__MOTORSPORT(DB);
        // await getStagesByCategory__MOTORSPORT(DB);
        await getSeasonsByStage__MOTORSPORT(DB);
    } catch (e) {
        console.log(e);
    } finally {
        await DB.pool.end();
    }
    // await HIT.categories();
}

main();
