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
import { DB_NAME, TABLE_NAMES } from '../../config/NAMES';
import * as dotenv from 'dotenv';
dotenv.config();

export class MYSQL_DB {
    static config: PoolOptions = {
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        host: process.env.DB_HOST,
        port: 25060,
        database: process.env.DB_NAME,
        connectionLimit: 10,
        multipleStatements: true,
    } as PoolOptions;

    errors: string[];
    pool: Pool;

    constructor() {
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
                console.log(`selectWhere:`, selectWhereStatement);
                console.log(`params:`, whereClauseParams);
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

            console.log(`whereClauseSQL`, whereClauseSQL);
            console.log('whereClauseParams', whereClauseParams);

            const sql = `UPDATE ${table} SET ${setClause} ${whereClauseSQL}`;
            const params = [...setParams, ...whereClauseParams];

            console.log(`sql`, sql);
            console.log('params', params);

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

            // Define the SQL query with multiple rows
            const columns = Object.keys(data[0]).join(', ');
            const sql = `INSERT ${
                ignore ? 'IGNORE ' : ''
            }INTO ${tableName} (${columns}) VALUES ${valuePlaceholders}`;

            // Execute the query with all the values
            await this.pool.execute(sql, values);

            //console.log('Data inserted successfully.');
            return true;
        } catch (error) {
            console.error('Error inserting data:', error);
            return false;
        }
    }
    async cleanTable(tableName: string): Promise<boolean> {
        try {
            if (!this.pool) {
                throw new Error(
                    'Pool was not created. Ensure the pool is created when running the app.'
                );
            }
            const deleteAllRecordsSql = `DELETE FROM ${tableName};`;
            await this.pool.execute(deleteAllRecordsSql);
            return true;
        } catch (e) {
            throw `cleanTable failed for table: ${tableName}: ${e}`;
        }
    }
    async INSERT_GETID(
        table: string,
        values: { [key: string]: any }
    ): Promise<
        [
            (
                | RowDataPacket[]
                | RowDataPacket[][]
                | OkPacket
                | OkPacket[]
                | ResultSetHeader
            ),
            FieldPacket[]
        ]
    > {
        console.log(`INSERT_GETID`);
        if (!this.pool) {
            throw new Error(
                'Pool was not created. Ensure pool is created when running the app.'
            );
        }

        const [setClause, setParams] = this.formatSetClause(values);
        const sql = `INSERT INTO ${table} SET ${setClause}`;
        const params = [...setParams];

        // for debuggin we log the simple sql statement
        const plainSql = sql.replace(/\?/g, (match) =>
            typeof params[0] === 'string'
                ? `'${params.shift()}'`
                : params.shift()
        );

        try {
            return await this.pool.execute(plainSql);
        } catch (e) {
            console.error(e);
            throw new Error(`Error in INSERT_GETID`);
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
