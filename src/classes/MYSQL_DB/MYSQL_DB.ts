import {
    createPool,
    FieldPacket,
    OkPacket,
    Pool,
    PoolOptions,
    ResultSetHeader,
    RowDataPacket,
} from 'mysql2/promise';
import { ConditionClause } from './types';
import * as dotenv from 'dotenv';
dotenv.config();

export class MYSQL_DB {
    static config: PoolOptions = {
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        host: process.env.DB_HOST,
        port: 25060,
        connectionLimit: 10,
        multipleStatements: true,
    } as PoolOptions;

    errors: string[];
    pool: Pool;

    constructor(dbName: string = 'Football') {
        MYSQL_DB.config.database = dbName;
        this.pool = {} as Pool;
        this.errors = [];
    }
    /**
     * Connect to DB using the config in the static section
     * This version assumes we have several DBs in a given cluster
     */
    createPool() {
        try {
            const config: PoolOptions = {
                ...MYSQL_DB.config,
            };
            this.pool = createPool(config);
            return 'MySql pool generated successfully';
        } catch (e) {
            console.error('Error: ', e);
            throw new Error('failed to initialized pool');
        }
    }
    /**
     * The brainless version which accepts very well
     * defined variables and writes the SQL so that
     * there's no room for SQL mistakes. There's a clear
     * separation between SQL and JS. MUCH better...
     * @param tableName
     * @param whereClause
     * @returns
     */
    async SELECT<T>(
        tableName: string,
        whereClause?: ConditionClause,
        likeClause?: ConditionClause
    ): Promise<T[]> {
        if (!this.pool) {
            throw new Error(
                'Pool was not created. Ensure pool is created when running the app.'
            );
        }

        try {
            const [whereClauseSQL, whereClauseParams] =
                this.formatWhereClause(whereClause);
            const [likeClauseSQL, likeClauseParams] =
                this.formatLikeClause(likeClause);

            const selectStatement = `SELECT * FROM ${tableName}`;

            // console.log(`whereClauseSQL:`, whereClauseSQL);

            let result;
            let fullParams = [...whereClauseParams, ...likeClauseParams];

            if (!whereClause && !likeClause) {
                // No whereClause or likeClause
                result = await this.pool.execute(selectStatement + ';');
            } else if (!whereClause) {
                // There's a likeClause and no whereClause
                // Here we need to add a WHERE -- Still needs testing
                const selectLikeStatement = `${selectStatement} WHERE ${likeClauseSQL}`;
                result = await this.pool.execute(
                    selectLikeStatement,
                    likeClauseParams
                );
            } else if (!likeClause) {
                // There's a whereClause and no likeClause
                // The formatted whereClause already contains the word 'WHERE'
                const selectWhereStatement = `${selectStatement} ${whereClauseSQL}`;
                //console.log(`selectWhere:`, selectWhereStatement);
                //console.log(`params:`, whereClauseParams);
                result = await this.pool.execute(
                    selectWhereStatement,
                    whereClauseParams
                );
            } else {
                // There's also a WhereClause and a LikeClause
                const selectWhereLikeStatement = `${selectStatement} WHERE ${whereClauseSQL} AND (${likeClauseSQL})`;
                result = await this.pool.execute(
                    selectWhereLikeStatement,
                    fullParams
                );
            }

            if (
                Array.isArray(result) &&
                result.length > 0 &&
                Array.isArray(result[0])
            ) {
                return result[0] as T[];
            } else {
                return [];
            }
        } catch (e) {
            console.warn(`Error in SELECT: ${e}`);
            throw new Error(`Error in SELECT: ${e}`);
        }
    }
    /**
     * Here the whereClause is not optional
     * @param table
     * @param values
     * @param whereClause
     * @returns
     */
    async UPDATE(
        table: string,
        values: Record<string, any>,
        whereClause: ConditionClause
    ): Promise<boolean> {
        if (!this.pool) {
            throw new Error(
                'Pool was not created. Ensure pool is created when running the app.'
            );
        }
        try {
            const [setClause, setParams] = this.formatSetClause(values);
            const [whereClauseSQL, whereClauseParams] =
                this.formatWhereClause(whereClause);

            // console.log(`whereClauseSQL`, whereClauseSQL);
            // console.log('whereClauseParams', whereClauseParams);

            const sql = `UPDATE ${table} SET ${setClause} ${whereClauseSQL}`;
            const params = [...setParams, ...whereClauseParams];

            // console.log(`sql`, sql);
            // console.log('params', params);

            const [result] = await this.pool.execute(sql, params);
            return (result as OkPacket).affectedRows === 1;
        } catch (e) {
            throw new Error(`Error in UPDATE: ${e}`);
        }
    }
    /**
     * To be continued
     * @param newsItems
     * @returns
     */
    async INSERT_BATCH<T extends Object>(
        data: T[],
        tableName: string,
        ignore: boolean
    ): Promise<boolean> {
        if (!this.pool) {
            throw new Error(
                'Pool was not created. Ensure the pool is created when running the app.'
            );
        }
        try {
            // Build an array of value placeholders for each data item
            const numKeys = Object.keys(data[0]).length;
            const oneArrayPlaceHolder = `(${Array(numKeys)
                .fill('?')
                .join(', ')})`;
            //console.warn(`Placeholder: ${oneArrayPlaceHolder}`);
            const valuePlaceholders = data
                .map(() => oneArrayPlaceHolder)
                .join(', ');

            // Flatten the data array to create a single array of values
            // const values = data.flatMap((item) => Object.values(item));
            const values = data.flatMap((item) =>
                Object.values(item).map((value) =>
                    value !== undefined ? value : null
                )
            );

            //console.log(`VALUES: ${JSON.stringify(values)}`);

            // // Define the SQL query with multiple rows
            // const columns = Object.keys(data[0]).join(', ');
            // const sql = `INSERT ${
            //     ignore ? 'IGNORE ' : ''
            // }INTO ${tableName} (${columns}) VALUES ${valuePlaceholders}`;

            // Define the SQL query with multiple rows
            const columns = Object.keys(data[0]).join(', ');
            const updateColumns = Object.keys(data[0])
                .map((col) => `${col}=VALUES(${col})`)
                .join(', ');
            let sql = `INSERT`;
            sql += ignore ? ' IGNORE' : '';
            sql += ` INTO ${tableName} (${columns}) VALUES ${valuePlaceholders}`;
            sql += ignore ? '' : ` ON DUPLICATE KEY UPDATE ${updateColumns}`;
            // Execute the query with all the values
            await this.pool.execute(sql, values);

            // console.warn(`sql: ${sql}`);
            // console.warn(`values: ${JSON.stringify(values)}`);

            //console.log('Data inserted successfully.');
            return true;
        } catch (error) {
            console.error('Error inserting data:', error);
            return false;
        }
    }
    async INSERT_BATCH_OVERWRITE<T extends Object>(
        data: T[],
        tableName: string
    ) {
        if (!this.pool) {
            throw new Error(
                'Pool was not created. Ensure the pool is created when running the app.'
            );
        }
        try {
            // Check if data is empty
            if (!data.length) {
                throw new Error('No data provided for batch insert.');
            }

            // Log the incoming data
            // console.log('Data:', JSON.stringify(data, null, 2));

            // Construct the value placeholders and flatten the data
            const numKeys = Object.keys(data[0]).length;
            const oneArrayPlaceHolder = `(${Array(numKeys)
                .fill('?')
                .join(', ')})`;
            const valuePlaceholders = data
                .map(() => oneArrayPlaceHolder)
                .join(', ');

            // Convert dates and flatten data
            const values = data.flatMap((item) =>
                Object.values(item).map((value) => {
                    return value !== undefined ? value : null;
                })
            );

            const columns = Object.keys(data[0])
                .map((col) => `\`${col}\``)
                .join(', ');
            const updateColumns = Object.keys(data[0])
                .map((col) => `\`${col}\` = VALUES(\`${col}\`)`)
                .join(', ');

            // Construct the SQL query
            let sql = `INSERT INTO ${tableName} (${columns}) VALUES ${valuePlaceholders}`;
            sql += ` ON DUPLICATE KEY UPDATE ${updateColumns}`;

            // Detailed logging
            // console.log('Final SQL Query:', sql);
            // console.log('Query Parameters:', values);

            // Execute the query
            const [result]: [ResultSetHeader, any] = await this.pool.execute(
                sql,
                values
            );

            // Log the result object for debugging
            // console.log(
            //     'INSERT_BATCH_OVERWRITE result:',
            //     JSON.stringify(result, null, 4)
            // );

            const affected = result.affectedRows || 0;
            const changed = result.changedRows || 0;
            const inserted = affected - changed;

            // console.log(
            //     `INSERT_BATCH_OVERWRITE: ${affected} rows affected, ${changed} rows changed, ${inserted} rows inserted.`
            // );
            return { inserted, affected, changed };
        } catch (error) {
            console.error('SQL Execution Error:', error);
            throw new Error(
                `INSERT_BATCH_OVERWRITE Error: ${(error as Error).message}`
            );
        }
    }
    formatWhereClause(whereClause?: ConditionClause): [string, any[]] {
        let sql = '';
        const params: any[] = [];
        if (whereClause) {
            sql +=
                'WHERE ' +
                Object.keys(whereClause)
                    .map((key) => `${key} = ?`)
                    .join(' AND ');
            Object.values(whereClause).forEach((value) => params.push(value));
        }
        return [sql, params];
    }
    /**
     * Here we pass the object to be formatted
     * AS IS. BRAINLESSSS
     * @param values
     * @returns
     */
    formatSetClause<T extends Record<string, any>>(values: T): [string, any[]] {
        const setClause = Object.keys(values)
            .map((key) => `${key} = ?`)
            .join(', ');
        const setParams = Object.values(values);
        return [setClause, setParams];
    }
    formatLikeClause(likeClause?: ConditionClause): [string, any[]] {
        let sql = '';
        const params: any[] = [];

        if (likeClause) {
            sql +=
                Object.keys(likeClause)
                    .map((key, index) => {
                        const condition = `${key} LIKE ?`;
                        params.push(`%${likeClause[key]}%`);

                        return index === 0
                            ? `(${condition}`
                            : ` OR ${condition}`;
                    })
                    .join('') + ')';
        }

        return [sql, params];
    }
}
