# MessTy DSL

MessTy uses a domain-specific language (DSL) for describing the structure of a message. It is designed to be easy to read and write.

## Basic Syntax
``` 
type <name> {
    <field> : <type> | string | number | boolean
    ...
}

message <name> { 
    <field> : <type> | string | number | boolean
    ...
}

topic <name> {
    <message>
    ...
}
```

## Primary Types

### String `string`

A string is a sequence of characters. It is represented by a sequence of characters enclosed in double quotes.

### Number `number`

A number is a sequence of digits. It is represented by a sequence of digits.

### Boolean `boolean`

A boolean is a logical value. It is represented by the keywords `true` or `false`.

## Type

A type is a collection of fields. They are required to have a distinct `<name>` inside their `namespace`. The name of a type has tp start with a capital letter. By referring to the name of a type you can compose types together to create more complex types.

```
type Person {
    name: string
    age: number
}

type Employee {
    person: Person
    salary: number
}
```

## Message

A message is a collection of fields. They are required to have a distinct `<name>` inside their `namespace`. These are the messages that will be parsed by the MessTy client.

```
message NewEmployee {
    startDate: date
    employee: Employee
}
```

## Topic
A topic is a collection of messages.

```
topic Employee {
    NewEmployee
    ...
}
```



