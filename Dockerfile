FROM node:10

# Env

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . /usr/src/app

RUN npm start tsc

EXPOSE 8080

CMD [ "npm", "start" ]