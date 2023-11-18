export const allSportsAPIURLs = {
    categories: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/categories`,
    tournaments: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/all/category/`, //expects category number at the end
    leagueseasons: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/seasons`, //replace tournamentId
    standings: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/season/seasonId/standings/total`,
    teamPlayers: `https://allsportsapi2.p.rapidapi.com/api/cricket/team/teamId/players`,
    topPlayers: `https://allsportsapi2.p.rapidapi.com/api/cricket/tournament/tournamentId/season/seasonId/top-players`,
    

    hostHeader: `allsportsapi2.p.rapidapi.com`,
};
