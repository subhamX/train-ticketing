# Ensure that the following env variables are set
# REACT_APP_SERVER_URL : Server URL for the frontend; Default: /
# DATABASE_URL : Database Connection URL for the postgres database
# SESSION_SECRET : Random string for session auth tokens
# CLIENT_URL : Client URL; Default: /
# PORT : Port on which the server should run

# build environment
FROM node:13.12.0-alpine as builder

# # set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH
# install app dependencies
RUN apk add --no-cache git
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install
# add app
COPY frontend/ ./
RUN npm run build

FROM node:13.12.0-alpine AS production

WORKDIR /
# copy files to server
COPY --from=builder /frontend/build ./dist/build
# install app dependencies
RUN apk add --no-cache git
COPY server/package.json ./
COPY server/package-lock.json ./
RUN npm install
COPY server/ ./
RUN npm i -g typescript
RUN npm run build

CMD ["npm", "start"]