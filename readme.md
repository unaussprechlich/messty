# MessTy (Prototype)

MessTy is a Toolchain/Framework to support end-to-end type safety in Apache Kafka. 

"Docs" can be found [here](https://unaussprechlich.github.io/messty)

## Setup
`pnpm install`

## Outline
This is the outline of the project. For now a `__typename` field is used to define the schema key. All Typescript types are defined in [zod](https://zod.dev) to ensure easy validation and type safety.

### /packages/messty-core
The core client-library of MessTy. 

### /packages/messty-dsl
A DSL [langium-tool](https://langium.org/) to generate the typescript types from the messty schema with . Also contains a vscode extension for the DSL.

### /packages/messty-provider-kafka
A provider to use Apache Kafka as a message broker. This adapter can be plugged into the core client-library.

### /apps/consumer-toaster
Basic consumer implementation.

### /apps/producer-butler
Basic producer implementation.

### /apps/types
The Schema and Typescript types shared between the producer and consumer.
