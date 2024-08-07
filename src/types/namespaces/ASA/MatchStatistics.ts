export namespace ASA.MatchStatistics {
    export type Item = {
        name: string;
        home: string;
        away: string;
        compareCode: string;
        statisticsType: string;
        valueType: 'event' | 'team';
        homeValue: string;
        awayValue: string;
        renderType: string;
        key: string;
        homeTotal?: string;
        awayTotal?: string;
    };

    export type Group = {
        groupName: string;
        statisticsItems: { [key: number]: Item };
    };

    export type Statistics = {
        [key: number]: {
            period: string;
            groups: Group[];
        };
    };
}
