import axios, { AxiosResponse } from 'axios';
import { TABLES } from '../../config/NAMES';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import {
    AllSports__Category,
    DB__Category,
} from '../../types/allSportsApi/Cats';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import * as dotenv from 'dotenv';
import { ASA } from '../../types/namespaces/ASA';
import { DB } from '../../types/namespaces/DB';
dotenv.config();

export async function getCategories__CRICKET(DB: MYSQL_DB): Promise<boolean> {
    const funcName = `getCategories__CRICKET`;
    try {
        await DB.cleanTable(TABLES.cricketCategories.name);

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

        const response: AxiosResponse<{ categories: ASA.Category[] }> =
            await axios.request(axiosRequest);
        const categories: ASA.Category[] = response.data.categories;
        const categoriesDB: DB.Category[] = categories.map(
            (category: ASA.Category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                sport_id: category.sport.id,
            })
        );

        const insertResult = await DB.INSERT_BATCH<DB.Category>(
            categoriesDB,
            TABLES.cricketCategories.name,
            false
        );
        console.log(`Insert result: ${insertResult}`);
        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}
