import { allSportsAPIURLs } from '../../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
dotenv.config();

export function buildGetRequest(
    url: string,
    params: { [key: string]: string }
) {
    const headers: { [key: string]: string } = {
        'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
        'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
    };

    let builtUrl = url;
    for (const key in params) {
        builtUrl = builtUrl.replace(key, params[key]);
    }

    const request = {
        method: 'GET',
        url: builtUrl,
        headers,
    };
    return request;
}
