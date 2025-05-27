# 1) Base Node.js
FROM node:18-slim

# 2) Instala o FFmpeg no mesmo container
RUN apt-get update \
 && apt-get install -y ffmpeg \
 && rm -rf /var/lib/apt/lists/*

# 3) Copia package.json e instala dependências
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

# 4) Copia seu código da API
COPY server.js ./

# 5) Expõe a porta da API
EXPOSE 80

# 6) Comando padrão
CMD ["npm", "start"]
