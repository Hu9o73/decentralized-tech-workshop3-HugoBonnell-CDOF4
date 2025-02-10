import express, { Express } from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


// Import endpoints
import endpoints from "./api/endpoints";

// Import database
import { healthCheckRouter, sequelize } from "./ConfigFiles/dbConfig";
import { testDatabaseConnection } from "./ConfigFiles/dbUtils";

const cors = require('cors');

const app: Express = express();
const port = 3000;

// Body parser
app.use(express.json());

// CORS for any origin: 
app.use(cors());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Swagger version
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the backend',
    },
  },
  apis: ['./src/api/endpoints.ts'], // Path to the API route files (can be specific files or directories)
};

// Heath check endpoint
app.use('/health', healthCheckRouter);

// Use the endpoints defined
app.use(endpoints);

// Serve Swagger UI at /api-docs
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Database test connection
testDatabaseConnection(sequelize);

// Start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

