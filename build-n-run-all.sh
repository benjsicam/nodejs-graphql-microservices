#!/bin/bash

cd graphql-gateway && npm run build && cd -
cd grpc-services/comments && npm run build && cd -
cd grpc-services/posts && npm run build && cd -
cd grpc-services/users && npm run build && cd -
docker-compose up
