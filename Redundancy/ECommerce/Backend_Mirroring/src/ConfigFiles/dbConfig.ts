import { Sequelize } from 'sequelize';
import { Router } from 'express';

require('dotenv').config();

const masterConfig = {
  host: process.env.DB_HOST,
  port: 3307,
  dialect: 'mysql' as const,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialectOptions: {
    authPlugins: {
      caching_sha2_password: () => () => Buffer.from(process.env.DB_PASSWORD!)
    }
  },
  logging: false
};

const slaveConfig = {
  ...masterConfig,
  port: 3308,
};

let sequelize = new Sequelize(masterConfig);
const router = Router();

router.get('/health', async (req, res) => {
  try {
    await sequelize.query('SELECT 1');
    res.status(200).json({ status: 'healthy', connection: 'master' });
  } catch (error) {
    try {
      sequelize = new Sequelize(slaveConfig);
      await sequelize.query('SELECT 1');
      res.status(200).json({ status: 'healthy', connection: 'slave' });
    } catch (slaveError) {
      res.status(503).json({ status: 'unhealthy', error: 'All databases unavailable' });
    }
  }
});

export { router as healthCheckRouter, sequelize };

export default sequelize;