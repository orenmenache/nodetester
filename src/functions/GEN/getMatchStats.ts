import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import * as dotenv from 'dotenv';
import { DB } from '../../types/namespaces/DB';
import fs from 'fs';
import { ASA } from '../../types/namespaces/ASA/MatchStatistics';
dotenv.config();

/**
 * We get the standings for every league
 * and with that we get the ids and info of the teams
 */
export async function getMatchStats__GENERIC(
    sportName: DB.SportName,
    DB: MYSQL_DB
) {
    // : Promise<boolean> {
    const funcName = `getPlayerStatsByMatch__GENERIC`;

    const lastMatchesTableName = `${sportName}.RAPID__LASTMATCHES`;
    const matchStatsTableName = `${sportName}.RAPID__MATCH_STATISTICS`;

    const hyphenated: string =
        sportName === 'AmericanFootball'
            ? 'american-football'
            : sportName.toLowerCase();

    try {
        const lastMatches = await DB.SELECT<DB.AmericanFootball.LastMatch>(
            lastMatchesTableName
        );

        // console.warn(`lastMatches: ${lastMatches.length}`);
        // return;

        for (let match of lastMatches) {
            try {
                const url = `https://allsportsapi2.p.rapidapi.com/api/${hyphenated}/match/${match.id}/statistics`;
                const headers = {
                    'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
                    'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
                };
                const axiosRequest = {
                    method: 'GET',
                    url,
                    headers,
                };
                const response = await axios.request(axiosRequest);
                if (!response.data) throw `!response.data`;
                if (!response.data.statistics)
                    throw `!response.data.statistics`;
                const statisticsArray = response.data
                    .statistics as ASA.MatchStatistics.Statistics;

                let dbItems: DB.AmericanFootball.MatchStatistics[] = [];

                for (let key in statisticsArray) {
                    if (!statisticsArray[key].groups)
                        throw `!statisticsArray[key].groups`;
                    const groups: ASA.MatchStatistics.Group[] =
                        statisticsArray[key].groups;

                    for (let groupNum in groups) {
                        const group: ASA.MatchStatistics.Group =
                            groups[groupNum];

                        if (!group.statisticsItems) continue;
                        for (let statKey in group.statisticsItems) {
                            const item: ASA.MatchStatistics.Item =
                                group.statisticsItems[statKey];
                            const dbItem: DB.AmericanFootball.MatchStatistics =
                                {
                                    match_id: match.id,
                                    group_name: group.groupName,
                                    name: item.name,
                                    home: item.home,
                                    away: item.away,
                                    compare_code: item.compareCode,
                                    statistics_type: item.statisticsType,
                                    value_type: item.valueType,
                                    home_value: item.homeValue,
                                    away_value: item.awayValue,
                                    render_type: item.renderType,
                                    asa_key_name: item.key,
                                    home_total: item.homeTotal,
                                    away_total: item.awayTotal,
                                };

                            dbItems.push(dbItem);
                        }
                    }
                }

                const { affected } = await DB.INSERT_BATCH_OVERWRITE(
                    dbItems,
                    matchStatsTableName
                );
                console.log(`affected: ${affected}`);
                // return;
            } catch (e) {
                console.warn(
                    `match.id: ${match.id} ${match.slug} failed: ${e}`
                );
                // return;
            }
        }

        return true;
    } catch (e) {
        throw `${funcName} failed: ${e}`;
    }
}
