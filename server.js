
  // service-config/server.js
  const express = require('express');
  const cors = require('cors');
  const fs = require('fs-extra');
  const yaml = require('js-yaml');
  const path = require('path');
  const dotenv = require('dotenv');
  
  // Charger les variables d'environnement
  dotenv.config();
  
  const app = express();
  const PORT = process.env.PORT || 8888;
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Répertoire des configurations
  const CONFIG_DIR = path.join(__dirname, 'configs');
  
  // Assurer que le répertoire existe
  fs.ensureDirSync(CONFIG_DIR);
  
  // Route pour obtenir la configuration d'un service
  app.get('/config/:service/:env', (req, res) => {
    const { service, env } = req.params;
    const configPath = path.join(CONFIG_DIR, `${service}-${env}.yml`);
    
    try {
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = yaml.load(configContent);
        res.json(config);
      } else {
        res.status(404).json({ error: `Configuration pour ${service} en environnement ${env} non trouvée` });
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture de la configuration: ${error.message}`);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de la configuration' });
    }
  });
  
  // Route pour mettre à jour la configuration d'un service
  app.post('/config/:service/:env', (req, res) => {
    const { service, env } = req.params;
    const configPath = path.join(CONFIG_DIR, `${service}-${env}.yml`);
    const config = req.body;
    
    try {
      const yamlStr = yaml.dump(config);
      fs.writeFileSync(configPath, yamlStr, 'utf8');
      res.json({ success: true, message: `Configuration pour ${service} en environnement ${env} mise à jour` });
    } catch (error) {
      console.error(`Erreur lors de l'écriture de la configuration: ${error.message}`);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la configuration' });
    }
  });
  
  // Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`Service de configuration démarré sur le port ${PORT}`);
  });


  
