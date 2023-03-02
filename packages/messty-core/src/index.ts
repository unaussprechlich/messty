import 'reflect-metadata';
import * as console from 'console';
import { IProvider } from './types';
import { ZodLiteral, ZodObject, z, ZodType, Schema } from 'zod';

export interface IConfig<
  TypeMap extends {
    [key in keyof TypeMap]: ZodObject<{
      __typename: ZodLiteral<key>;
    }>;
  },
  T extends string,
> {
  provider: IProvider;
  schema: TypeMap;
  topics: {
    [key in T]: unknown;
  };
}

export class Messty<
  TypeMap extends {
    [key in keyof TypeMap]: ZodObject<{
      __typename: ZodLiteral<key>;
    }>;
  },
  Topic extends string,
> {
  private _registry: {
    [key in Topic]?: {
      [key in keyof TypeMap]?: Array<(message: TypeMap[key]) => void>;
    };
  } = {} as any;

  constructor(private readonly config: IConfig<TypeMap, Topic>) {
    this.init().catch(console.error);

    // Bind methods to this instance to avoid issues while calling them from outside
    this.register = this.register.bind(this);
    this.On = this.On.bind(this);
  }

  private _getHandlers(topic: Topic, type: keyof TypeMap) {
    if (!this._registry[topic]) this._registry[topic] = {};
    if (!this._registry[topic]?.[type])
      this._registry[topic]![type] = [] as any;

    return this._registry[topic]![type]!!;
  }
  async init() {
    if (this.config.provider.hasConsumer()) {
      //todo subscribe with generic options
      await this.config.provider.subscribe(Object.keys(this.config.topics));
      this.config.provider.onMessage<Topic>(async (payload) => {
        const topic = this._registry[payload.topic];

        // If no handlers are registered for this topic, ignore the message
        if (!topic) return;

        const message = JSON.parse(payload.message!!);

        if (!message || !message.__typename) throw new Error('Invalid message');

        const __typename = message.__typename as keyof TypeMap;
        const handlers = topic[__typename];

        // If no handlers are registered for this type, ignore the message
        if (!handlers) return;

        const schema = this.config.schema[__typename];

        // If no schema is registered for this type, throw an error
        if (!schema) {
          throw new Error(
            'No schema found for __typename=' + __typename.toString(),
          );
        }

        // Parse the message to ensure it matches the schema
        const parsedMessage = schema.parse(message);

        for (const handler of handlers) {
          await handler(parsedMessage as any);
        }
      });
    }
  }

  async send<
    SchemaKey extends keyof TypeMap,
    T extends z.infer<TypeMap[SchemaKey]>,
  >(topic: Topic, message: T) {
    if (!this.config.provider.hasProducer())
      throw new Error('Producer not configured');

    const __typename = message.__typename as SchemaKey;
    const schema = this.config.schema[__typename];

    if (!schema)
      throw new Error(
        'No schema found for __typename=' + __typename.toString(),
      );

    // Parse the message to ensure it matches the schema
    const parsedMessage = schema.parse(message);

    return this.config.provider.send({
      topic: topic.toString(),
      message: JSON.stringify(parsedMessage),
    });
  }

  register(consumer: any) {
    const handlerKeys = Reflect.getMetadata('messty:handlers', consumer);

    if (!handlerKeys)
      throw new Error(
        'No handlers found. Did you forget to add the @On decorator?',
      );

    for (const key of handlerKeys) {
      const topic = Reflect.getMetadata('messty:topic', consumer, key);
      const schema = Reflect.getMetadata('messty:schema', consumer, key);
      this.addHandler(topic, schema, consumer[key].bind(consumer));
    }
  }

  private addHandler<T extends TypeMap[keyof TypeMap]>(
    topic: Topic,
    type: keyof TypeMap,
    handler: (message: T) => void,
  ) {
    const handlers = this._getHandlers(topic, type);
    handlers.push(handler as any);
  }

  On<SchemaKey extends keyof TypeMap, T extends z.infer<TypeMap[SchemaKey]>>(
    topic: Topic,
    schemaKey: SchemaKey,
  ) {
    return function decorator(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<(message: T) => void>,
    ) {
      Reflect.defineMetadata('messty:topic', topic, target, propertyKey);
      Reflect.defineMetadata('messty:schema', schemaKey, target, propertyKey);

      const handlerKeys = Reflect.getMetadata('messty:handlers', target) || [];
      handlerKeys.push(propertyKey);
      Reflect.defineMetadata('messty:handlers', handlerKeys, target);
      return descriptor;
    };
  }

  Schema<key extends string, T extends keyof TypeMap>(schemaKey: T) {
    return this.config.schema[schemaKey] as unknown as z.infer<TypeMap[T]>;
  }
}
