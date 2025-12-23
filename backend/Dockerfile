# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# копируем package.json раньше — для layer cache
COPY package.json package-lock.json* ./

RUN npm ci --only=production

# копируем исходники
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]