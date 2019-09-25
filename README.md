# Node Graphql + gRPC microservices

This project is a [monorepo](https://gomonorepo.org/) containing a [GraphQL](https://graphql.org/) API gateway with [gRPC](https://grpc.io/) back-end microservices all written in Node.js. This project is mainly used for learning/trial purposes only.

## Graph Model

When creating GraphQL APIs, one must understand what [Graph Theory](https://en.wikipedia.org/wiki/Graph_theory) and Graph Data Modelling are. One must also [think in graphs](https://graphql.org/learn/thinking-in-graphs/) as per the GraphQL specification recommends. A diagram of the graph data model is shown below.

![Graph Model](https://raw.githubusercontent.com/benjsicam/node-graphql-microservices/master/docs/img/graph-model.png)

1. Users can write both posts and comments therefore, a users are authors posts and comments.
2. Posts are authored by users and comments can be linked/submitted for them.
3. Comments are authored by users and are linked/submitted to posts.

## Architecture Overview
 
The GraphQL API acts as a gateway/proxy for the different microservices it exposes. The resolvers of the GraphQL API make calls to the gRPC servers/microservices in the back-end through gRPC client implementations of the back-end services which are defined through [Protocol Buffers](https://developers.google.com/protocol-buffers/) that also serves as the data interchange format. The gRPC microservices then handles the request to connect to databases or any other service it needs to serve requests.

### Diagram

A diagram of the architecture is shown below.

![Architecture Diagram](https://raw.githubusercontent.com/benjsicam/node-graphql-microservices/master/docs/img/archi-diagram.png)

This architecture implements the following Microservice Design Patterns:

1. [Microservice Architecture](https://microservices.io/patterns/microservices.html)
2. [Subdomain Decomposition](https://microservices.io/patterns/decomposition/decompose-by-subdomain.html)
3. [Externalized Configuration](https://microservices.io/patterns/externalized-configuration.html)
4. [Remote Procedure Invocation](https://microservices.io/patterns/communication-style/rpi.html)
5. [API Gateway](https://microservices.io/patterns/apigateway.html)
6. [Database per Service](https://microservices.io/patterns/data/database-per-service.html)
7. [CQRS](https://microservices.io/patterns/data/cqrs.html) - GraphQL implements CQRS by default through resolution of graphs

### Benefits

Some of the benefits of adopting a microservice architecture are:

**Individual Deployment**

Each app can be deployed separately without knowledge of the other application. Each service is reusable in the entire tech stack. Upgrades can also be done in isolation from other application/microservice. This makes hot fixes and quick roll backs possible.

**Fault Isolation**

When an error or fault occurs, one will immediately know where it came from and debugging can be done immediately.

**Easier Testing and Debugging**

Having a very small codebase per microservice makes doing tests easier and debugging quicker by orders of magnitude.

**Granular Scaling**

Scaling can also be done on a per microservice deployment. Each microservice application can scale separately of others if it is serving more load than the others.

**Better Observability**

Operations will have better observability on the application as a whole since monitoring and logging can be done with granularity as is not mixed with other parts of the application.

## Architecture Layers

### API Layer

[GraphQL](https://graphql.org/) acts as the API Layer for the architecture. It takes care of listening for user requests and proxying those requests to the appropriate back-end microservice. The framework used for GraphQL in this application is [graphql-yoga](https://github.com/prisma/graphql-yoga).

### Microservice Layer

[gRPC](https://grpc.io/) was chosen as the framework to do the microservices. [Protocol buffers](https://developers.google.com/protocol-buffers/) was used as the data interchange format between the client (GraphQL API) and the server (gRPC microservices). The framework used for gRPC in this application is [Mali](https://mali.js.org/)

### Data Layer

PostgreSQL is used as the database and Redis is used as the cache.

## Deployment

Deployment is done with containers in mind. A Docker Compose file along with Dockerfiles for each project are given to run the whole thing on any machine. For production, it's always recommended to use [Kubernetes](https://kubernetes.io/) for these kinds of microservices architecture to deploy in production. [Istio](https://istio.io/) takes care of service discovery, distributed tracing and other observability requirements.

## How to Run

[![GraphQL + gRPC Microservices](https://raw.githubusercontent.com/benjsicam/node-graphql-microservices/master/docs/img/vid-preview.jpg)](https://youtu.be/SuH2K92FOaE)
