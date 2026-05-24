# Utilisation de l'image Node.js 20-alpine comme base (compatible avec Prisma)
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec npm install au lieu de npm ci pour éviter les problèmes de version
RUN npm install --only=production

# Copier le reste du code source
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start"]
