import { AxiosRequestConfig } from 'axios';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
dotenv.config();

export function generateAxiosRequest(
    templateUrl: string,
    replaceParams: { [key: string]: string },
    strict: boolean = true
): AxiosRequestConfig {
    if (!process.env.ALLSPORTS_KEY) throw 'ALLSPORTS_KEY not found in .env';

    let url = templateUrl;
    for (let key in replaceParams) {
        if (strict && !url.includes(key)) throw `key ${key} not found in url`;
        url = url.replace(key, replaceParams[key]);
    }

    const headers = {
        'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
        'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
    };
    const axiosRequest: AxiosRequestConfig = {
        method: 'GET',
        url,
        headers,
    };
    return axiosRequest;
}
