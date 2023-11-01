FROM node:lts
# required line
WORKDIR /vscode-extension

COPY ./package*.json .
# install the node modules
RUN npm install

COPY . .

# 8080 is what our webpack runs on
EXPOSE 8080
# start extension
ENTRYPOINT [ "npm", "start"]