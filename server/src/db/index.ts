import { Pool, QueryResult } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()
const clientInfo = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
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
