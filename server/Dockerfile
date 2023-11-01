FROM node:lts
WORKDIR /

COPY ./package.json .
# install the node modules
RUN npm install

COPY . .

EXPOSE 80
ENTRYPOINT [ "npm", "start"]