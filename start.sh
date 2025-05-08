#!/bin/bash

# Démarrer les services d'infrastructure
cd service-config && npm run dev &
cd ../service-register && npm run dev &
cd ../service-proxy && npm run dev &
cd ../service-users && npm run dev &

# Démarrer le backend de l'application
cd ../event-emergent-backend && npm run dev &

# Démarrer le frontend de l'application
cd ../event-emergent-frontend && npm start &

# Attendre que l'utilisateur appuie sur une touche pour arrêter tous les processus
echo "Tous les services ont été démarrés. Appuyez sur une touche pour arrêter..."
read -n 1 -s

# Arrêter tous les processus en arrière-plan
kill $(jobs -p)