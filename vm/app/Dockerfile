FROM node:lts
# Set working directory
WORKDIR /app

COPY ./package*.json .
RUN npm install

# Copy all files from current directory to working dir in image
COPY . .

ENV PORT 80
<<<<<<< HEAD
<<<<<<< HEAD
ENV WDS_SOCKET_PORT 443
=======
# ENV WDS_SOCKET_PORT 443
>>>>>>> 89988377 (Setup React App and Transcription to Run on VM.)
=======
ENV WDS_SOCKET_PORT 443
>>>>>>> a18fb3c7 (Changed to handle new VM certificate.)
ENTRYPOINT [ "npm", "start"]