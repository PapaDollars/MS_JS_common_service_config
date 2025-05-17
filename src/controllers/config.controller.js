const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG_DIR = process.env.CONFIG_DIR || './config';

// Récupérer la configuration d'un service spécifique
exports.getServiceConfig = (req, res) => {
  const { service, profile = 'default' } = req.params;
  
  try {
    const configPath = path.join(CONFIG_DIR, `${service}.yml`);
    
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({
        message: `Configuration pour ${service} non trouvée`
      });
    }
    
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents);
    
    // Si un profil spécifique est demandé
    if (profile !== 'default' && config.profiles && config.profiles[profile]) {
      return res.json({
        name: service,
        profile: profile,
        source: 'config-service',
        properties: {
          ...config.common,
          ...config.profiles[profile]
        }
      });
    }
    
    // Renvoyer la config par défaut
    res.json({
      name: service,
      profile: 'default',
      source: 'config-service',
      properties: config.common || config
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération de la config pour ${service}:`, error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de la configuration',
      error: error.message
    });
  }
};

// Lister tous les services configurés
exports.listServices = (req, res) => {
  try {
    const files = fs.readdirSync(CONFIG_DIR);
    const services = files
      .filter(file => file.endsWith('.yml'))
      .map(file => file.replace('.yml', ''));
    
    res.json({
      services
    });
  } catch (error) {
    console.error('Erreur lors de la liste des services:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de la liste des services',
      error: error.message
    });
  }
};