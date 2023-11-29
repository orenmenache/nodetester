import axios, { AxiosResponse } from 'axios';
import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { allSportsAPIURLs } from '../../config/allSportsAPIURLs';
import { DB__LeagueSeason } from '../../types/allSportsApi/Seasons';
import {
    AllSports__LastMatch,
    DB__LastMatch,
} from '../../types/allSportsApi/Match/Cricket/LastMatch';
import { TABLE_NAMES } from '../../config/NAMES';
import { formatDateToSQLTimestamp } from '../formatToMySQLTimestamp';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getLastMatches__CRICKET(DB: MYSQL_DB) {
    const funcName = `getLastMatches__CRICKET`;
    DB.createPool();

    const headers = {
        'X-RapidAPI-Key': process.env.ALLSPORTS_KEY!,
        'X-RapidAPI-Host': allSportsAPIURLs.hostHeader,
    };

    try {
        await DB.cleanTable(TABLE_NAMES.cricketLastMatches);

        const allLeagueSeasons: DB__LeagueSeason[] =
            await DB.SELECT<DB__LeagueSeason>(TABLE_NAMES.cricketLeagueSeasons);

        for (const ls of allLeagueSeasons) {
            try {
                const url = allSportsAPIURLs.CRICKET.lastMatches
                    .replace('tournamentId', ls.tournament_id.toString())
                    .replace('seasonId', ls.id.toString());

                const axiosRequest = {
                    method: 'GET',
                    url,
                    headers,
                };

                const response: AxiosResponse<{
                    events: AllSports__LastMatch[];
                }> = await axios.request(axiosRequest);

                if (!response.data.events) throw 'No events in response';

                let lastMatches: DB__LastMatch[] = [];

                for (const event of response.data.events) {
                    const dbLastMatch: DB__LastMatch = {
                        tournament_id: event.tournament.uniqueTournament.id,
                        winnerCode: event.winnerCode,
                        homeTeamId: event.homeTeam.id,
                        homeTeamName: event.homeTeam.name,
                        awayTeamId: event.awayTeam.id,
                        awayTeamName: event.awayTeam.name,
                        homeScore: event.homeScore.current,
                        awayScore: event.awayScore.current,
                        id: event.id,
                        startTimestamp: formatDateToSQLTimestamp(
                            new Date(Number(event.startTimestamp) * 1000)
                        ),
                        note: event.note,
                        slug: event.slug,
                    };
                    lastMatches.push(dbLastMatch);
                }
                const insertResult = await DB.INSERT_BATCH<DB__LastMatch>(
                    lastMatches,
                    TABLE_NAMES.cricketLastMatches,
                    true
                );

                console.log(`Insert result: ${insertResult} for ${ls.name}`);

                /**
                 * Updates the league's hasLastMatches flag in the database.
                 */
                const updateLeagueHasLastMatches = async () => {
                    const updateResult = await DB.UPDATE(
                        TABLE_NAMES.cricketLeagueSeasons,
                        { hasLastMatches: 1 },
                        { id: ls.id }
                    );

                    console.log(
                        `Update result: ${updateResult} for ${ls.id} ${ls.name}`
                    );
                };
                await updateLeagueHasLastMatches();
            } catch (e) {
                console.warn(`Error @ ls: ${ls.id} ${ls.name}: ${e}`);
            }
        }
    } catch (e) {
        throw `Error in ${funcName}: ${e}`;
    }
}

// Example JSON event:
const ExampleEvent = {
    tournament: {
        name: 'Ireland in Zimbabwe, 3 T20I Series',
        slug: 'ireland-in-zimbabwe-3-t20i-series',
        category: {
            name: 'World',
            slug: 'world',
            sport: { name: 'Cricket', slug: 'cricket', id: 62 },
            id: 1343,
            flag: 'international',
        },
        uniqueTournament: {
            name: 'T20 International',
            slug: 't20-international',
            primaryColorHex: '#0680b1',
            secondaryColorHex: '#00c6ad',
            category: {
                name: 'World',
                slug: 'world',
                sport: { name: 'Cricket', slug: 'cricket', id: 62 },
                id: 1343,
                flag: 'international',
            },
            userCount: 8895,
            crowdsourcingEnabled: false,
            hasPerformanceGraphFeature: false,
            id: 11191,
            country: {},
            hasEventPlayerStatistics: false,
            displayInverseHomeAwayTeams: false,
        },
        priority: 0,
        id: 110288,
    },
    customId: 'VeAbsqfAb',
    status: { code: 100, description: 'Ended', type: 'finished' },
    winnerCode: 1,
    homeTeam: {
        name: 'Zimbabwe',
        slug: 'zimbabwe',
        shortName: 'ZIM',
        gender: 'M',
        sport: { name: 'Cricket', slug: 'cricket', id: 62 },
        userCount: 3014,
        nameCode: 'ZIM',
        national: true,
        type: 0,
        id: 187745,
        country: { alpha2: 'ZW', name: 'Zimbabwe' },
        subTeams: [],
        teamColors: {
            primary: '#eade00',
            secondary: '#269d2f',
            text: '#269d2f',
        },
    },
    awayTeam: {
        name: 'Ireland',
        slug: 'ireland',
        shortName: 'IRE',
        gender: 'M',
        sport: { name: 'Cricket', slug: 'cricket', id: 62 },
        userCount: 3134,
        nameCode: 'IRL',
        national: true,
        type: 0,
        id: 187766,
        country: { alpha2: 'IE', name: 'Ireland' },
        subTeams: [],
        teamColors: {
            primary: '#139442',
            secondary: '#ffffff',
            text: '#ffffff',
        },
    },
    homeScore: {
        current: 118,
        display: 118,
        innings: { inning1: { score: 118, wickets: 5, overs: 18 } },
    },
    awayScore: {
        current: 114,
        display: 114,
        innings: { inning1: { score: 114, wickets: 10, overs: 19.2 } },
    },
    coverage: 1,
    time: {},
    changes: {
        changes: [
            'status.code',
            'status.description',
            'status.type',
            'homeScore.current',
            'homeScore.display',
            'homeScore.innings',
        ],
        changeTimestamp: 1673532711,
    },
    hasGlobalHighlights: false,
    crowdsourcingDataDisplayEnabled: false,
    id: 10925785,
    note: 'Zimbabwe beat Ireland by 5 wickets',
    endTimestamp: 1673532660,
    startTimestamp: 1673521200,
    slug: 'ireland-zimbabwe',
    periods: {
        current: 'Match',
        inning1: '1st Inning',
        inning2: '2nd Inning',
        inning3: '3rd Inning',
        inning4: '4th Inning',
    },
    finalResultOnly: false,
    isEditor: false,
    crowdsourcingEnabled: false,
};
