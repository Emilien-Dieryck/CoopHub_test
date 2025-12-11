#!/bin/bash
# ============================================
# CoopHub - Script de démarrage
# Lance le backend et le frontend simultanément
# ============================================

echo "🚀 Démarrage de CoopHub..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Répertoire racine du projet
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Fonction pour arrêter les processus à la fermeture
cleanup() {
    echo -e "\n${YELLOW}⏹️  Arrêt des serveurs...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT SIGTERM

# Vérifier si les dépendances sont installées
echo -e "${BLUE}📦 Vérification des dépendances...${NC}"

if [ ! -d "$ROOT_DIR/backend/node_modules" ]; then
    echo -e "${YELLOW}📥 Installation des dépendances backend...${NC}"
    cd "$ROOT_DIR/backend" && npm install
fi

if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
    echo -e "${YELLOW}📥 Installation des dépendances frontend...${NC}"
    cd "$ROOT_DIR/frontend" && npm install
fi

# Lancer le backend
echo -e "${GREEN}🔧 Démarrage du backend (port 4000)...${NC}"
cd "$ROOT_DIR/backend" && npm run dev &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 2

# Lancer le frontend
echo -e "${GREEN}🎨 Démarrage du frontend (port 5173)...${NC}"
cd "$ROOT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}✅ CoopHub est lancé !${NC}"
echo -e "${BLUE}   Backend:  http://localhost:4000${NC}"
echo -e "${BLUE}   Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}   Appuyez sur Ctrl+C pour arrêter${NC}\n"

# Attendre les processus
wait
