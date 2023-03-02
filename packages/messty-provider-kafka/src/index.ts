import {
  Kafka,
  KafkaConfig,
  Producer,
  ProducerConfig,
  Consumer,
  ConsumerConfig,
} from "kafkajs";
import { IProvider } from "messty-core/src/types";
export class KafkaProvider implements IProvider {
  private _kafka: Kafka;
  private readonly _producer: Producer | undefined;
  private _isProducerConnected: boolean = false;
  private readonly _consumer: Consumer | undefined;
  private _isConsumerConnected: boolean = false;

  hasProducer() {
    return !!this._producer;
  }

  hasConsumer() {
    return !!this._consumer;
  }

  constructor(config: {
    kafkaConfig: KafkaConfig;
    producerConfig?: ProducerConfig | null;
    consumerConfig?: ConsumerConfig | null;
  }) {
    this._kafka = new Kafka(config.kafkaConfig);
    if (config.producerConfig) {
      this._producer = this._kafka.producer(config.producerConfig);

      this._producer?.on("producer.disconnect", () => {
        this._isProducerConnected = false;
      });

      this._producer?.on("producer.connect", () => {
        this._isProducerConnected = true;
      });

      this._producer.connect().catch(console.error);
    }
    if (config.consumerConfig) {
      this._consumer = this._kafka.consumer(config.consumerConfig);

      this._consumer?.on("consumer.disconnect", () => {
        this._isConsumerConnected = false;
      });

      this._consumer?.on("consumer.connect", () => {
        this._isConsumerConnected = true;
      });

      this._consumer.connect().catch(console.error);
    }
  }

  async subscribe(topic: string | string[]) {
    if (!this._consumer) throw new Error("Consumer not configured");
    if (typeof topic === "string") {
      await this._consumer.subscribe({ topic: topic });
    } else {
      await this._consumer.subscribe({ topics: topic });
    }
  }

  async onMessage<Topic>(
    handler: (payload: {
      topic: Topic;
      message: string | null;
    }) => Promise<void>
  ) {
    if (!this._consumer) throw new Error("Consumer not configured");
    return this._consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await handler({
          topic: topic as Topic,
          message: message.value?.toString() ?? null,
        });
      },
    });
  }

  async send(record: { topic: string; message: string }) {
    if (!this._producer) throw new Error("Producer not configured");
    await this._producer.send({
      topic: record.topic,
      messages: [{ value: record.message }],
    });
  }
}
