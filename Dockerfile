# FROM node:22-alpine
# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install --omit=dev

# COPY . .

# EXPOSE 8080

# CMD ["node", "dist/main"]

FROM node:22-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . ./

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/main.js"]
