import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Read the swagger YAML file
const swaggerFilePath = path.join(__dirname, '../docs/swagger.yaml');
const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerDocument = YAML.parse(swaggerFile);

// Swagger UI options
const swaggerOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar {
      background-color: #2c3e50;
      padding: 10px 0;
    }
    .swagger-ui .topbar .download-url-wrapper .select-label {
      color: white;
    }
    .swagger-ui .info .title {
      color: #2c3e50;
      font-size: 36px;
      font-weight: 600;
    }
    .swagger-ui .info .description {
      font-size: 16px;
      line-height: 1.6;
    }
    .swagger-ui .scheme-container {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background-color: #61affe;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background-color: #49cc90;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background-color: #fca130;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background-color: #f93e3e;
    }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background-color: #50e3c2;
    }
  `,
  customSiteTitle: 'Visa Application System v2 API',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
    requestInterceptor: req => {
      return req;
    },
    responseInterceptor: res => {
      return res;
    },
  },
};

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, swaggerOptions));

// Serve the raw swagger document as JSON
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerDocument);
});

// Serve the raw swagger document as YAML
router.get('/swagger.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.send(swaggerFile);
});

export default router;
