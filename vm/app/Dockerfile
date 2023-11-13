FROM node:lts
# Set working directory
WORKDIR /app

COPY ./package*.json .
RUN npm install

# Copy all files from current directory to working dir in image
COPY . .

ENV PORT 80
<<<<<<< HEAD
ENV WDS_SOCKET_PORT 443
=======
# ENV WDS_SOCKET_PORT 443
>>>>>>> 89988377 (Setup React App and Transcription to Run on VM.)
ENTRYPOINT [ "npm", "start"]