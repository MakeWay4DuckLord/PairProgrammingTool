FROM node:lts

# required
WORKDIR /

# this is good for optimization

COPY ./package.json .
COPY ./package-lock.json .

# install the node modules
RUN npm install

COPY . .

# Port that WebSocket runs on
EXPOSE 80
ENTRYPOINT [ "npm", "start"]