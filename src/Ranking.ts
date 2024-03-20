import { MYSQL_DB } from './classes/MYSQL_DB/MYSQL_DB';
import { runFunctionWithRetry } from './functions/RunFunctionWithRetry';
import { DB } from './types/namespaces/DB';

export type TopRankingTeam = {
    id: string;
    teamName: string;
    matches: number;
    points: number;
    ranking: number;
    rating: number;
    gameType: 'odi' | 'test' | 't20';
    created_at: string;
    teamId: string;
};

export async function getTeamIds(): Promise<boolean> {
    const DB = new MYSQL_DB();
    DB.createPool();
    try {
        const fn = async () =>
            await DB.SELECT<TopRankingTeam>(`Cricket.CORE_ICC_TEAM_RANKING`);
        const topTeams: TopRankingTeam[] = await runFunctionWithRetry(fn, 5);
        // sort so that the latest entries are first
        topTeams.sort((a, b) => {
            return Number(a.created_at) - Number(b.created_at);
        });

        const topThirtyTeams = [
            ...topTeams.filter((team) => team.gameType === 'odi').slice(-10),
            ...topTeams.filter((team) => team.gameType === 'test').slice(-10),
            ...topTeams.filter((team) => team.gameType === 't20').slice(-10),
        ];

        const teamNames: string[] = topThirtyTeams.map((team) => team.teamName);
        const uniqueTeamNames: string[] = [...new Set(teamNames)];

        const baseQuery = 'SELECT * FROM Cricket.CORE__TEAMS WHERE ';
        const conditions = uniqueTeamNames
            .map((team) => `name = '${team}'`)
            .join(' OR ');

        const query = baseQuery + conditions;
        const teamsRes = await DB.pool.execute(query);
        const teams = teamsRes[0] as DB.Team[];

        if (teams.length === 0) throw `No teams found`;
        if (teams.length !== uniqueTeamNames.length)
            throw `Found ${uniqueTeamNames.length} names out of ${teams.length} teams`;

        for (const teamName of uniqueTeamNames) {
            const topTeam = topThirtyTeams.find(
                (team) => team.teamName === teamName
            );
            const team = teams.find((team) => team.name === teamName);
            if (!team) throw `Team ${teamName} not found`;
            if (!topTeam) throw `Top team ${teamName} not found`;

            await DB.UPDATE(
                'Cricket.CORE_ICC_TEAM_RANKING',
                { teamId: team.id },
                { teamName: topTeam.teamName }
            );
        }
        return true;
    } catch (e) {
        console.warn(`Error in getTeamIds: ${e}`);
        return false;
    } finally {
        await DB.pool.end();
    }
}
