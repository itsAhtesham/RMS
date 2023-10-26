import pg, {PoolConfig} from 'pg';
const { Pool } = pg;

const pool = new Pool({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:'amsssid',
    database:'RMS-TS',
} as PoolConfig);

export default pool;
