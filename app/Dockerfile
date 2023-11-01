FROM node:lts
WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
# install the node modules
RUN npm install

COPY . .

EXPOSE 3000
ENTRYPOINT [ "npm", "start"]