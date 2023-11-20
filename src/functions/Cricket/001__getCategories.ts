import axios, { AxiosResponse } from 'axios';
import { TABLE_NAMES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import {
    AllSports__Category,
    DB__Category,
} from '../../types/allSportsApi/Cats';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getCategories__CRICKET(DB: MYSQL_DB) {
    const funcName = `getCategories__CRICKET`;
    try {
        await DB.cleanTable(TABLE_NAMES.cricketCategories);

        const url = allSportsAPIURLs.CRICKET.categories;
        const headers = {
            'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
            'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
        };

        const axiosRequest = {
            method: 'GET',
            url,
            headers,
        };

        const response: AxiosResponse<{ categories: AllSports__Category[] }> =
            await axios.request(axiosRequest);
        const categories: AllSports__Category[] = response.data.categories;
        const categoriesDB: DB__Category[] = categories.map(
            (category: AllSports__Category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                priority: category.priority,
                flag: category.flag,
                alpha2: category.alpha2,
                sport_id: category.sport.id,
            })
        );

        const insertResult = await DB.INSERT_BATCH<DB__Category>(
            categoriesDB,
            TABLE_NAMES.cricketCategories,
            false
        );
        console.log(`Insert result: ${insertResult}`);
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}
