# Kafka Provider

//todo
```ts 
new KafkaProvider({
    kafkaConfig: {
      clientId: "toaster",
      brokers: ["localhost:9092"],
    },
    consumerConfig: { groupId: "test-group" },
  }),
  schema: MesstyCustomTypes,
  topics: {
    "test-topic": {},
    foo: {},
  },
});
```
