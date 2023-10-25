FROM node:lts
# Set working directory
WORKDIR /peer

# install node modules
COPY ./package*.json .
RUN npm install

# Copy all files from current directory to working dir in image
COPY . .

ENV PORT 443
EXPOSE 443
ENTRYPOINT [ "npm", "start"]