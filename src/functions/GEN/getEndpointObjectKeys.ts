import axios from 'axios';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
dotenv.config();

export type KeyStructure = {
    key: string;
    level: number;
    parent?: string;
};

export async function getEndpointObjectKeys(endPoint: string) {
    if (!process.env.ALLSPORTS_KEY) throw `!process.env.ALLSPORTS_KEY`;

    console.warn(`endPoint: ${endPoint}`);

    try {
        const headers = {
            'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
            'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
        };
        const axiosRequest = {
            method: 'GET',
            url: endPoint,
            headers,
        };

        // console.warn(`axiosRequest: ${JSON.stringify(axiosRequest, null, 4)}`);
        // throw `testing`;
        const response = await axios.request(axiosRequest);
        // console.log(`response.data: ${JSON.stringify(response.data, null, 4)}`);
        // throw `testing`;
        if (!response.data) throw `!response.data`;

        const keys = getObjectKeysRecursive(response.data);
        return keys;
    } catch (e) {
        throw `getEndpointObjectKeys failed: ${e}`;
    }
}

function getObjectKeysRecursive(
    obj: Record<string, any>,
    level = 0,
    parent?: string
) {
    let keys: KeyStructure[] = [];
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            keys = keys.concat(
                ...keys,
                getObjectKeysRecursive(
                    obj[key],
                    level + 1,
                    parent ? `${parent}.${key}` : key
                )
            );
        } else {
            keys.push({ key, level, parent });
        }
    }
    return keys;
}
