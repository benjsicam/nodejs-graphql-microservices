#!/bin/bash

docker-compose -f docker-compose.test.yaml run --rm api-gateway npm test
