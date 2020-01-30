FROM node:10.18.1

WORKDIR /usr/src/api
COPY package.json .
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]