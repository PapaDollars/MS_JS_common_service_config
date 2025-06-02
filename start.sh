#!/bin/bash

# Définir les couleurs pour les logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Obtenir le chemin absolu du répertoire courant
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Afficher un message de bienvenue
echo -e "${GREEN}Démarrage de l'architecture microservices Emergent24 ${NC}"
echo "=========================================================="

# Fonction pour vérifier si un service est disponible
check_service() {
    local PORT=$1
    local MAX_RETRIES=5
    local RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if curl -s "http://localhost:$PORT/health" > /dev/null; then
            return 0
        fi
        RETRY_COUNT=$((RETRY_COUNT + 1))
        sleep 2
    done
    return 1
}

# Fonction pour démarrer un service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    local command=$4

    echo "Démarrage du service $service_name sur le port $port..."
    
    # Vérifier si le port est déjà utilisé
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Erreur: Le port $port est déjà utilisé.${NC}"
        return 1
    fi

    # Démarrer le service
    cd "$service_path" && $command &
    local pid=$!
    
    # Attendre que le service démarre
    echo "Attente du démarrage du service $service_name..."
    sleep 5
    
    # Vérifier si le service est en cours d'exécution
    if ps -p $pid > /dev/null; then
        echo -e "${GREEN}Le service $service_name a démarré avec succès (PID: $pid)${NC}"
        return 0
    else
        echo -e "${RED}Erreur: Le service $service_name n'a pas pu démarrer.${NC}"
        return 1
    fi
}

# Fonction pour vérifier et exécuter les migrations de base de données
run_migrations() {
    SERVICE_DIR=$1
    DB_NAME=$2
    
    echo -e "${YELLOW}Vérification de la base de données $DB_NAME...${NC}"
    
    # Se positionner dans le répertoire du service
    cd $SERVICE_DIR
    
    # Vérifier si la base de données existe, sinon la créer
    echo "Création de la base de données $DB_NAME si elle n'existe pas..."
    mysql -u root -p root -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;" 2>/dev/null
    
    # Vérifier si sequelize-cli est installé
    if [ ! -f "node_modules/.bin/sequelize-cli" ]; then
        echo -e "${YELLOW}Installation de sequelize-cli...${NC}"
        npm install --save-dev sequelize-cli
    fi
    
    # Exécuter les migrations
    echo "Exécution des migrations pour $DB_NAME..."
    npx sequelize-cli db:migrate
    
    # Revenir au répertoire précédent
    cd ..
    
    echo -e "${GREEN}Migrations terminées pour $DB_NAME${NC}"
}

# Démarrer les services dans l'ordre
start_service "service-config" "MS_JS_common_service_config" 8888 "node src/index.js"
start_service "service-register" "MS_JS_common_service_register" 8761 "node src/index.js"
start_service "service-proxy" "MS_JS_common_service_proxy" 8080 "node src/index.js"
start_service "service-users" "MS_JS_common_service_users" 8081 "node src/index.js"
start_service "emergent24-ticket-backend" "projet_emergent24-ticket/back-end" 8082 "node src/server.js"
start_service "emergent24-ticket-frontend" "projet_emergent24-ticket/front-end" 3000 "npm run dev"

echo "Tous les services ont été démarrés avec succès!"
echo "URL des services:"
echo "- Service Configuration: http://localhost:8888"
echo "- Service Registre: http://localhost:8761"
echo "- Service Proxy: http://localhost:8080"
echo "- Service Utilisateurs: http://localhost:8081"
echo "- Backend Emergent24-Ticket: http://localhost:8082"
echo "- Frontend Emergent24-Ticket: http://localhost:3000"