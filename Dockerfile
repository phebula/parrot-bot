FROM node:17-alpine AS build
WORKDIR /usr/app
COPY ./tsconfig.json ./
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
RUN yarn global add typescript
COPY ./src/ ./
RUN tsc -p tsconfig.json

FROM node:17-alpine
WORKDIR /usr/app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --production
COPY --from=build /usr/app/out ./js
CMD [ "node", "js/index.js" ]