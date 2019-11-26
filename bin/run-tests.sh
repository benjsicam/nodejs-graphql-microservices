#!/bin/bash

docker-compose -f docker-compose.test.yaml run --rm graphql-gateway npm test
