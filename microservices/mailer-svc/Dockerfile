FROM node:12-alpine as build

WORKDIR /usr/local/mailer-svc

ADD dist package.json ./

RUN npm install --production

FROM node:12-alpine

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.2 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

WORKDIR /usr/local/mailer-svc

COPY --from=build /usr/local/mailer-svc .

EXPOSE 50051

CMD ["node", "index.js"]
