FROM node:14-alpine

USER node
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --production

COPY . .

CMD ["npm", "run", "server:production"]