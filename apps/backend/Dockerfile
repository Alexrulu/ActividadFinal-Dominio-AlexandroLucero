# Etapa base
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json del backend
COPY apps/backend/package*.json ./apps/backend/

# Instalar dependencias
RUN npm install --prefix ./apps/backend

# Copiar todo el backend
COPY apps/backend ./apps/backend

# Copiar la carpeta domain al mismo nivel que apps
COPY domain ./domain

# Exponer puerto
EXPOSE 3000

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev", "--prefix", "./apps/backend"]
