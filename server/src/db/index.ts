import { Pool, QueryResult } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()
const clientInfo = {
    user: process.env.PG_USERNAME,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: (process.env.PG_PORT as unknown) as number,
}
export const pool = new Pool(clientInfo)

const query = (text: string, params?: any): Promise<QueryResult<any>> =>
    pool.query(text, params)


const serializedTransaction = async (text: string, params?: any):  Promise<QueryResult<any>> => {
    const client = await pool.connect();
    try {
        await client.query('START TRANSACTION ISOLATION LEVEL SERIALIZABLE');
        let resp = await pool.query(text, params)
        await client.query('COMMIT')
        return resp;
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}
const db = {
    query,
    serializedTransaction
}
export default db
