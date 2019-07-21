FROM node:10-alpine as build

WORKDIR /usr/local/posts-svc

COPY dist ./

RUN npm install --production

FROM node:10-alpine

WORKDIR /usr/local/posts-svc

COPY --from=build /usr/local/posts-svc .

EXPOSE 50051

CMD ["node", "main.js"]
