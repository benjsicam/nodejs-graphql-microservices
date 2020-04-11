FROM node:12-alpine as build

WORKDIR /usr/local/comments-svc

COPY dist package.json ./

RUN apk add --no-cache make g++ python postgresql-dev \
  && npm install --production

FROM node:12-alpine

RUN apk add --no-cache postgresql-client

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.2 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

WORKDIR /usr/local/comments-svc

COPY --from=build /usr/local/comments-svc .

EXPOSE 50051

CMD ["node", "index.js"]
