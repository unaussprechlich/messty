import { KafkaProvider } from "messty-provider-kafka";
import { Messty } from "messty-core";
import { z } from "zod";
import MesstyCustomTypes, { TestMessage } from "messty-custom-types";

const { register, On } = new Messty({
  provider: new KafkaProvider({
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

class Toaster {
  @On("test-topic", "Test")
  onTest(message: TestMessage) {
    const person = message.person;
    console.log(message.test);
    console.log(
      "[onBrownie]",
      `This is a test message for ${person.firstName} ${person.lastName} (${person.age}):`,
      message.msg
    );
  }

  @On("test-topic", "Bread")
  onBread(message: { __typename: "Bread"; browning: string }) {
    console.log("[onTest]", message);
  }

  @On("test-topic", "Brownie")
  onBrownie(message: z.infer<(typeof MesstyCustomTypes)["Brownie"]>) {
    console.log("[onBread]", message);
  }
}

register(new Toaster());
