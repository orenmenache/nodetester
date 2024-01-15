import * as dotenv from 'dotenv';
import { HIT } from './functions/Football/functions/HIT';
import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import { getCategories__TENNIS } from './functions/Tennis/001__getCategories';
dotenv.config();

async function main() {
    const DB = new MYSQL_DB('Tennis');
    DB.createPool();

    try {
        await getCategories__TENNIS(DB);
    } catch (e) {
        console.log(e);
    } finally {
        await DB.pool.end();
    }
    // await HIT.categories();
}

main();
