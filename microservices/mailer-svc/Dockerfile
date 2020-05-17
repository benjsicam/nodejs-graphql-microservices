FROM node:12-alpine as build

WORKDIR /usr/local/mailer-svc

ADD dist package.json ./

RUN npm install --production

FROM node:12-alpine

ADD https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.3.2/grpc_health_probe-linux-amd64 /bin/grpc_health_probe

RUN chmod +x /bin/grpc_health_probe

WORKDIR /usr/local/mailer-svc

COPY --from=build /usr/local/mailer-svc .

EXPOSE 50051

CMD ["node", "index.js"]
