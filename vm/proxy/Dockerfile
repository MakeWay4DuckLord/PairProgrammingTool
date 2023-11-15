FROM nginx:latest

EXPOSE 80

COPY . .
COPY /etc/letsencrypt/live/sd-vm01.csc.ncsu.edu /etc/letsencrypt/live/sd-vm01.csc.ncsu.edu

CMD ["nginx", "-g", "daemon off;"]'