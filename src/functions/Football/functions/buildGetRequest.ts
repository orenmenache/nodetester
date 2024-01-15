import { headers } from '../../../config/HEADERS';

export function buildGetRequest(
    url: string,
    params: { [key: string]: string }
) {
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
