import { Pool, QueryResult } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();
const clientInfo = {
    user: process.env.PG_USERNAME,
    host:  process.env.PG_HOST,
    database:  process.env.PG_DATABASE,
    password:  process.env.PG_PASSWORD,
    port:  process.env.PG_PORT as unknown as number,
}
const pool = new Pool(clientInfo);

const query = (text:string, params?:any):Promise<QueryResult<any>> => pool.query(text, params);

const db = {
    query
}
export default db;
