FROM node:18.17.0-alpine3.18 as build

WORKDIR /app

COPY ./package.json ./

RUN npm install --force
RUN npm install nodemon -g

COPY ./ ./

CMD ["nodemon", "--exec", "npm", "start"]