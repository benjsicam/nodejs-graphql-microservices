FROM node:10-alpine as build

WORKDIR /usr/local/comments-svc

COPY dist ./

RUN npm install --production

FROM node:10-alpine

WORKDIR /usr/local/comments-svc

COPY --from=build /usr/local/comments-svc .

EXPOSE 8080

CMD ["node", "main.js"]
