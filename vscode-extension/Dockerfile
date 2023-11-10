FROM node:lts

# required line

WORKDIR /app

# optimize 8)

COPY ./package.json .
COPY ./package-lock.json .

# install the node modules

RUN npm install

COPY . .

# 8080 is what our webpack runs on
EXPOSE 8080

# start extension
ENTRYPOINT [ "npm", "start"]