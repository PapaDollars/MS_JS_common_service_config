const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');
const configRoutes = require('./routes/config.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

// Configuration du logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/config', configRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  logger.info(`Service Config démarré sur le port ${PORT}`);
});