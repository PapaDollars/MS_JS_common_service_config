const express = require('express');
const router = express.Router();

// Route de santé
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Route pour obtenir la configuration
router.get('/', (req, res) => {
    res.status(200).json({
        service: 'config-service',
        version: '1.0.0',
        status: 'UP'
    });
});

// Route pour l'enregistrement des services
router.post('/register', (req, res) => {
    const { name, host, port, healthUrl } = req.body;
    
    if (!name || !host || !port || !healthUrl) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    // Ici, vous pourriez stocker les informations dans une base de données
    console.log(`Service enregistré: ${name} (${host}:${port})`);
    
    res.status(200).json({
        message: 'Service enregistré avec succès',
        service: { name, host, port, healthUrl }
    });
});

// Route pour obtenir la configuration d'un service
router.get('/:serviceName/:profile', (req, res) => {
    const { serviceName, profile } = req.params;
    
    // Ici, vous pourriez récupérer la configuration depuis une base de données
    const config = {
        service: serviceName,
        profile: profile,
        properties: {
            // Configuration par défaut
            server: {
                port: 8080
            },
            database: {
                url: 'jdbc:mysql://localhost:3306/' + serviceName
            }
        }
    };
    
    res.status(200).json(config);
});

module.exports = router;
