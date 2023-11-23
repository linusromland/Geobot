FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --quiet

COPY . .

CMD  npm run start
