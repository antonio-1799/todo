import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv'

// Get environment variables
dotenv.config()

// Create connection via Sequelize
const db = new Sequelize(
    process.env.MYSQLDB_NAME || 'union_digital',
    process.env.MYSQLDB_USERNAME || 'root',
    process.env.MYSQLDB_PASSWORD || 'root', {
        host: process.env.MYSQLDB_HOST || 'localhost',
        timezone: process.env.TZ || '+08:00',
        dialect: 'mysql',
});

// export connection
export default db;