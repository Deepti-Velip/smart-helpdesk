FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY seed.js .

CMD ["node", "seed.js"]
