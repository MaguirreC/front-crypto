FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

RUN npm install -g @angular/cli@18.2.12 && \
    npm install --force


# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 4200

# Comando para iniciar Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll"]