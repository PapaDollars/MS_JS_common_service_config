const express = require('express');
const configController = require('../controllers/config.controller');

const router = express.Router();

// Route pour lister tous les services configurés
router.get('/services', configController.listServices);

// Route pour récupérer la configuration d'un service
router.get('/:service/:profile?', configController.getServiceConfig);

module.exports = router;