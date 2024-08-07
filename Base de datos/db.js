import pg from 'pg'

const config = {
  user: 'default',
  password: 'DaUg4zjXY6rq',
  host: 'ep-cool-leaf-a4pb9z2z.us-east-1.aws.neon.tech',
  database: 'CentinelAi',
  port: 5432,
};
export const conn = new pg.Pool(config);