FROM node:10-alpine as build

WORKDIR /usr/local/users-svc

COPY dist ./

RUN npm install --production

FROM node:10-alpine

WORKDIR /usr/local/users-svc

COPY --from=build /usr/local/users-svc .

EXPOSE 50051

CMD ["node", "index.js"]
