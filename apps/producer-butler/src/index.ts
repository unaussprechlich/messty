import { KafkaProvider } from "messty-provider-kafka";
import { Messty } from "messty-core";
import MesstyCustomTypes from "messty-custom-types";
async function ProducerButler() {
  const messty = new Messty({
    provider: new KafkaProvider({
      kafkaConfig: {
        clientId: "butler",
        brokers: ["localhost:9092"],
      },
      producerConfig: {},
    }),
    schema: MesstyCustomTypes,
    topics: {
      "test.topic": {},
    },
  });

  async function sendTest() {
    await messty.send("test.topic", {
      __typename: "Test",
      test: "test",
      msg: "This is a test message",
      person: {
        __typename: "Person",
        firstName: "John",
        lastName: "Doe",
        age: 42,
      },
    });
  }

  setInterval(sendTest, 5000);
}

ProducerButler().catch(console.error);
