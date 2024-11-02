FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only=development --verbose

COPY . .

EXPOSE 3000

CMD [ "npm","run","dev" ]