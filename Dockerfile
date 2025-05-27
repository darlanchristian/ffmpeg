# 1) Base Node.js
FROM node:18-slim

# 2) Instala o FFmpeg
RUN apt-get update \
 && apt-get install -y ffmpeg \
 && rm -rf /var/lib/apt/lists/*

# 3) Cria o diretório da aplicação e copia apenas o package.json
WORKDIR /app
COPY package.json ./

# 4) Instala as dependências
RUN npm install --production

# 5) Copia o restante do código
COPY server.js ./

# 6) Cria a pasta de saída de vídeos
RUN mkdir -p videos

# 7) Expõe a porta correta (sua API está rodando em 80)
EXPOSE 80

# 8) Comando padrão
CMD ["npm", "start"]
