# Utilisation de l'image Node.js 20-alpine pour le build
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install vite --save-dev && npm install

# Copier le reste du code source
COPY . .

# Construire l'application avec Vite
RUN npm run build

# Utilisation d'une image nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY ./nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
