 FROM node:latest

 WORKDIR /usr/src/app

 COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/

 EXPOSE 5000

 CMD ["node", "--experimental-modules", "server/server.mjs"]
