# Node Graphql + gRPC microservices

This project is a [monorepo](https://gomonorepo.org/) containing a GraphQL API gateway with gRPC back-end microservices all written in Node.js. This project is mainly used for learning/trial purposes only.

## Architecture Overview

The GraphQL API acts as a gateway/proxy for the different microservices it exposes. The resolvers of the GraphQL API make calls to the gRPC servers/microservices in the back-end through gRPC client implementations of the back-end services defined through protocol buffers. The gRPC microservices then acts as middleware to connect to databases or any other service it needs to serve requests.

A diagram showing the architecture is shown below.

![Architecture Diagram](https://cloudcraft.co/view/492a9a8b-6c0f-4d2e-a45d-f6cb7ad850cd?key=2V3NRzdfwu70ROtwT6tg0g&embed=true)

### API Layer

[GraphQL](https://graphql.org/) acts as the API Layer for the architecture. It takes care of listening for user requests and proxying those requests to the appropriate back-end microservice. The framework used for GraphQL in this application is the awesome [graphql-yoga](https://github.com/prisma/graphql-yoga).

### Microservice Layer

[gRPC](https://grpc.io/) was chosen as the framework to do the microservices. [Protocol buffers](https://developers.google.com/protocol-buffers/) was used as the data interchange format between the client (GraphQL API) and the server (gRPC microservices).

### Data Layer

PostgreSQL is used as the database and Redis is used as the cache.

### Deployment

Deployment is done with containers in mind. A Docker Compose file along with Dockerfiles for each project are given to run the whole thing on any machine. For production, it's always recommended to use [Kubernetes](https://kubernetes.io/) for these kinds of microservices architecture to deploy in production.

## How to Run

[![GraphQL + gRPC Microservices](https://i.ytimg.com/vi/S92PqC5pNDE/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLBa6t66wj4_6P-AkoYWT_gMGZPGbw)](https://www.youtube.com/watch?v=S92PqC5pNDE)
