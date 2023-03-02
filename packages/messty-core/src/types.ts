export interface IProvider {
  hasProducer(): boolean;
  hasConsumer(): boolean;
  subscribe(topic: string | string[]): Promise<void>;
  onMessage<Topics>(
    handler: (payload: {
      topic: Topics;
      message: string | null;
    }) => Promise<void>
  ): void;
  send(record: { topic: string; message: string }): Promise<void>;
}
