# Typescript

## Introduction

## Metaprogramming
::: info Definition
Metaprogramming is a programming technique in which computer programs have the ability to treat other programs as their data. It means that a program can be designed to read, generate, analyze or transform other programs, and even modify itself while running. In some cases, this allows programmers to minimize the number of lines of code to express a solution, in turn reducing development time. It also allows programs a greater flexibility to efficiently handle new situations without recompilation.

[https://en.wikipedia.org/wiki/Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming)
:::
Through the use of decorators, Typescript allows for metaprogramming. With the release of Typescript 5.0 the implementation of decorators will be standardized with the ECMAScript Decorators proposal.

With `reflect-metadata` you can use decorators to add metadata to a class, method, property, or parameter. This metadata can then be used by the Typescript compiler or a third party library at compile time or at runtime.

## Possible Decorators
```ts
interface IType {
    __typename: Readonly<string>;
}

class Foo implements IType {
    __typename: "foo";
    bar: string;
}
```

```ts
class Messty<TypeMap extends {
    [key: string]: IType;
}, Topic extends string>{
    register(consumer: Constructor){
        // register consumer
    }

    on(topic: Topic, type: keyof TypeMap){
        // decorator
    }
}

type TypeMap = {
    "foo": Foo;
}
```
## Usage
```ts 
const messty = new Messty<TypeMap, "foo-topic">({
    provider : new KafkaProvider({
        brokers: ["localhost:9092"],
        groupId: "my-group",
    }),
    topics : {
        "foo-topic": {
            fromBeginning: true,
        }
    }
})

class Consumer {
    
    @messty.on("foo-topic", "foo")
    onFoo(foo: Foo){
        // do something
    }
}
```
