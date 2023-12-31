import { MYSQL_DB } from '../../classes/MYSQL_DB/MYSQL_DB';
import { TABLES } from '../../config/NAMES';
import fs from 'fs';

export const RECONSTRUCT = {
    async leagueSeasons(DB: MYSQL_DB) {
        try {
            /**
             * Since we have constraints on the DB
             * we first need to delete all the data
             * from the tables that have foreign keys
             * to the table we want to reconstruct
             *
             * We need to do this in a specific order
             */
            const constrainedTablesByDescHirarchy = [
                TABLES.cricketNextMatches,
                TABLES.cricketLastMatches,
                //TABLES.cricketStandings,
                //TABLES.cricketStatistics,
                //TABLES.cricketTopPlayers,
                //TABLES.cricketPlayers,
                TABLES.cricketTeams,
                TABLES.cricketLeagueSeasons,
            ];

            for (const table of constrainedTablesByDescHirarchy) {
                const deleteResult = await DB.DELETETABLE(table.name);
                if (!deleteResult) break;
            }

            /**
             * Now that we have deleted all the data
             * from the tables that have foreign keys
             * to the table we want to reconstruct
             * we can reconstruct the table
             * and then reconstruct the tables
             * that have foreign keys to the table
             * we just reconstructed
             * in the same order we deleted them
             * (reverse order of the hierarchy)
             */

            const constrainedTablesByAscHirarchy =
                constrainedTablesByDescHirarchy.reverse();

            const createTables = async () => {
                for (const table of constrainedTablesByAscHirarchy) {
                    if (!table.createStatementSqlPath) continue;
                    const sqlStatement = this.getSqlStatementFromFile(
                        table.createStatementSqlPath
                    );
                    if (!sqlStatement) {
                        console.warn(
                            `No sql create statement, or incorrect sql statement filePath for table: ${table.name}`
                        );
                        continue;
                    }
                    const createResult = await DB.pool.execute(sqlStatement);
                    if (!createResult)
                        throw `Failed to create table ${table.name}`;
                    console.log(`Created table ${table.name}`);
                }
            };
            await createTables();

            const populateTables = async () => {
                for (const table of constrainedTablesByAscHirarchy) {
                    if (!table.dataPopulationFunction) continue;
                    const populateResult: boolean =
                        await table.dataPopulationFunction(DB);
                    if (!populateResult)
                        throw `Failed to populate table ${table.name}`;
                    console.log(`Populated table ${table.name}`);
                }
            };
            await populateTables();

            // const createLeagueSeasonsResult =
            //     await getLeagueSeasonsByTournament__CRICKET(DB);

            // if (!createLeagueSeasonsResult)
            //     throw `Failed to create leagueSeasons`;
        } catch (e) {
            console.warn(`Failed to reconstruct leagueSeasons: ${e}`);
        }
    },
    getSqlStatementFromFile(sqlFilePath: string) {
        try {
            const sqlStatement = fs.readFileSync(sqlFilePath, 'utf8');
            return sqlStatement;
        } catch (e) {
            console.warn(`Failed to get sql statement from file: ${e}`);
        }
    },
};
