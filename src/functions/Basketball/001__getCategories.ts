import axios, { AxiosResponse } from 'axios';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import {
    AllSports__Category,
    DB__Category,
} from '../../types/allSportsApi/Cats';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import * as dotenv from 'dotenv';
import { headers } from '../../config/HEADERS';
dotenv.config();

/**
 * Tested 201123
 */
export async function getCategories__BASKETBALL(DB: MYSQL_DB) {
    const funcName = `getCategories__BASKETBALL`;
    try {
        // await DB.cleanTable(TABLES.BASKETBALLCategories.name);

        const url = allSportsAPIURLs.BASKETBALL.categories;

        const axiosRequest = {
            method: 'GET',
            url,
            headers,
        };

        const response: AxiosResponse<{ categories: AllSports__Category[] }> =
            await axios.request(axiosRequest);

        const categories: AllSports__Category[] = response.data.categories;
        //console.log(JSON.stringify(categories));
        const categoriesDB: DB__Category[] = categories.map(
            (category: AllSports__Category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                priority: category.priority,
                flag: category.flag,
                sport_id: category.sport.id,
            })
        );

        // for (const cat of categoriesDB) {
        //     console.log(JSON.stringify(cat));
        // }

        const insertResult = await DB.INSERT_BATCH<DB__Category>(
            categoriesDB,
            TABLES.basketballCategories.name,
            false
        );
        console.log(`Insert result: ${insertResult}`);
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}
