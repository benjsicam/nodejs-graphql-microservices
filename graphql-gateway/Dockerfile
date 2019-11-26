FROM node:10-alpine as build

WORKDIR /usr/local/graphql-gateway

COPY dist package.json ./

RUN npm install --production

FROM node:10-alpine

WORKDIR /usr/local/graphql-gateway

COPY --from=build /usr/local/graphql-gateway .

EXPOSE 3000

CMD ["node", "index.js"]
