import { Sequelize } from 'sequelize';
import { Router } from 'express';

require('dotenv').config();

const masterConfig = {
  host: process.env.DB_HOST,
  port: 3307,
  dialect: 'mysql' as const,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD_MASTER,
  logging: false
};

const slaveConfig = {
  ...masterConfig,
  port: 3308,
  password: process.env.DB_PASSWORD_SLAVE
};

let sequelize = new Sequelize(masterConfig);
const router = Router();

let usingSlave = false;

router.get('/health', async (req, res) => {
    try {
      await sequelize.authenticate();
      res.status(200).json({ status: 'healthy', connection: usingSlave ? 'slave' : 'master' });
    } catch (error) {
      if (!usingSlave) {
        sequelize = new Sequelize(slaveConfig);
        usingSlave = true;
        try {
          await sequelize.authenticate();
          res.status(200).json({ status: 'healthy', connection: 'slave' });
        } catch (slaveError) {
          res.status(503).json({ status: 'unhealthy', error: 'All databases unavailable' });
        }
      } else {
        res.status(503).json({ status: 'unhealthy', error: 'All databases unavailable' });
      }
    }
  });

export { router as healthCheckRouter, sequelize };

export default sequelize;