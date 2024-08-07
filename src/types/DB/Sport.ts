import { DB } from '../namespaces/DB';

export type Sport = {
    id: string;
    name: DB.SportName;
    short_name: string;
    has_schedule: string;
    has_standings: string;
};
