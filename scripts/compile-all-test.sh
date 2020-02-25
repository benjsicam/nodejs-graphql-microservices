#!/bin/bash

cd api-gateway && npm i && npm run copy:protos && npm run compile:test && cd -
cd microservices/comments-svc && npm i && npm run copy:protos && npm run compile:test && cd -
cd microservices/posts-svc && npm i && npm run copy:protos && npm run compile:test && cd -
cd microservices/users-svc && npm i && npm run copy:protos && npm run compile:test && cd -
cd microservices/mailer-svc && npm i && npm run copy:protos && npm run compile && cd -
