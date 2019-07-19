#!/bin/bash

cd graphql-gateway && npm run copy:protos && npm run build && cd -
cd grpc-services/comments && npm run copy:protos && npm run build && cd -
cd grpc-services/posts && npm run copy:protos && npm run build && cd -
cd grpc-services/users && npm run copy:protos && npm run build && cd -
