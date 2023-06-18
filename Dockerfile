FROM node:17

#Working Dir
WORKDIR /app

#Copy pacakage.json files
COPY package*.json ./

#install files
RUN npm install

#copy source files
COPY . .

#Expose API Port
EXPOSE 3000

CMD ["node", "app/server.js"]