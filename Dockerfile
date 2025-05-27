FROM node:18-slim

RUN apt-get update \
 && apt-get install -y ffmpeg \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia só o package.json (remove o package-lock.json)
COPY package.json ./

RUN npm install --production

COPY server.js ./
RUN mkdir -p videos

EXPOSE 3000
CMD ["npm", "start"]
