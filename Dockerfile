FROM node:20

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --quiet

COPY . .

CMD  npm run start