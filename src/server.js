const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const configRoutes = require('./routes/config.routes');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/config', configRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Service de configuration opérationnel',
    status: 'UP'
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Service de configuration démarré sur le port ${PORT}`);
});