#!/bin/bash

# Définir les couleurs pour les logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Afficher un message de bienvenue
echo -e "${GREEN}Arrêt de l'architecture microservices Emergent24 ${NC}"
echo "========================================================"

echo "Arrêt des services..."

# Fonction pour arrêter un processus sur un port spécifique
stop_port() {
    local port=$1
    local service_name=$2
    echo "Arrêt du service $service_name sur le port $port..."
    
    # Trouver le PID du processus qui utilise le port
    local pid=$(lsof -ti :$port)
    
    if [ ! -z "$pid" ]; then
        echo "Arrêt du processus $pid"
        kill $pid
        sleep 2
        
        # Vérifier si le processus est toujours en cours
        if ps -p $pid > /dev/null; then
            echo "Le processus ne répond pas, arrêt forcé..."
            kill -9 $pid
        fi
    else
        echo "Aucun processus trouvé sur le port $port"
    fi
}

# Arrêter les services dans l'ordre inverse de leur démarrage
stop_port 3000 "emergent24-ticket-frontend"
stop_port 8082 "emergent24-ticket-backend"
stop_port 8081 "service-users"
stop_port 8080 "service-proxy"
stop_port 8761 "service-register"
stop_port 8888 "service-config"

echo "Vérification des processus restants..."
ps aux | grep "node" | grep -v grep

echo "Tous les services ont été arrêtés."