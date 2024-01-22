export const allSportsAPIURLs = {
    hostHeader: `allsportsapi2.p.rapidapi.com`,
    FOOTBALL: {
        categories: `https://allsportsapi2.p.rapidapi.com/api/tournament/categories`,
        tournaments: `https://allsportsapi2.p.rapidapi.com/api/tournament/all/category/`, //expects category number at the end
        leagueseasons: `https://allsportsapi2.p.rapidapi.com/api/tournament/tournamentId/seasons`, //replace tournamentId
        standings: `https://allsportsapi2.p.rapidapi.com/api/tournament/tournamentId/season/seasonId/standings/total`,
        teamPlayers: `https://allsportsapi2.p.rapidapi.com/api/team/teamId/players`,
        statistics: `https://allsportsapi2.p.rapidapi.com/api/tournament/tournamentId/season/seasonId/statistics`,
        lastMatches: `https://allsportsapi2.p.rapidapi.com/api/tournament/tournamentId/season/seasonId/matches/last/0`,
        nextMatches: `https://allsportsapi2.p.rapidapi.com/api/tournament/tournamentId/season/seasonId/matches/next/0`,
    },
    CRICKET: {
        categories: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/categories`,
        tournaments: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/all/category/`, //expects category number at the end
        leagueseasons: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/seasons`, //replace tournamentId
        standings: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/season/seasonId/standings/total`,
        teamPlayers: `https://allsportsapi2.p.rapidapi.com/api/cricket/team/teamId/players`,
        topPlayers: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/season/seasonId/top-players`,
        lastMatches: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/season/seasonId/matches/last/0`,
        nextMatches: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/season/seasonId/matches/next/0`,
    },
    TENNIS: {
        categories: `https://allsportsapi2.p.rapidapi.com/api/tennis/tournament/categories`,
        tournaments: `https://allsportsapi2.p.rapidapi.com/api/tennis/tournament/all/category/`, //expects category number at the end
        leagueseasons: `https://allsportsapi2.p.rapidapi.com/api/tennis/tournament/tournamentId/seasons`, //replace tournamentId
        nextMatches: `https://allsportsapi2.p.rapidapi.com/api/tennis/tournament/tournamentId/season/seasonId/events/next/0`,
    },
    BASKETBALL: {
        categories: `https://allsportsapi2.p.rapidapi.com/api/basketball/tournament/categories`,
        tournaments: `https://allsportsapi2.p.rapidapi.com/api/basketball/tournament/all/category/`, //expects category number at the end
        leagueseasons: `https://allsportsapi2.p.rapidapi.com/api/basketball/tournament/tournamentId/seasons`, //replace tournamentId
        nextMatches: `https://allsportsapi2.p.rapidapi.com/api/basketball/tournament/tournamentId/season/seasonId/matches/next/0`,
    },
    MOTORSPORT: {
        categories: `https://allsportsapi2.p.rapidapi.com/api/motorsport/categories`,
        stages: `https://allsportsapi2.p.rapidapi.com/api/motorsport/category/categoryId/stages/all`, //expects category number at the end
        seasons: `https://allsportsapi2.p.rapidapi.com/api/motorsport/unique-stage/stageId/season`, //replace stageId
    },
};
