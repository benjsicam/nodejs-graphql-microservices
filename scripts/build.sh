#!/bin/bash

cd api-gateway && npm run copy:protos && npm run compile && cd -
cd microservices/comments-svc && npm run copy:protos && npm run compile && cd -
cd microservices/posts-svc && npm run copy:protos && npm run compile && cd -
cd microservices/users-svc && npm run copy:protos && npm run compile && cd -
cd microservices/mailer-svc && npm run copy:protos && npm run compile && cd -
docker-compose build --no-cache
