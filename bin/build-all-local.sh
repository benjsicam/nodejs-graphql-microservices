#!/bin/bash

cd graphql-gateway && npm i && npm run copy:protos && npm run compile && cd -
cd grpc-services/comments && npm i && npm run copy:protos && npm run compile && cd -
cd grpc-services/posts && npm i && npm run copy:protos && npm run compile && cd -
cd grpc-services/users && npm i && npm run copy:protos && npm run compile && cd -
cd grpc-services/mailer && npm i && npm run copy:protos && npm run compile && cd -
docker-compose build --no-cache
