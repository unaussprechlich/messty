import { z } from 'zod';

const Person = z.object({
  __typename: z.literal('Person'),

  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
});
export const TestMessageSchema = z.object({
  __typename: z.literal('Test'),
  test: z.string(),
  msg: z.string(),
  person: Person,
});
export type TestMessage = z.infer<typeof TestMessageSchema>;
export const BreadMessageSchema = z.object({
  __typename: z.literal('Bread'),
  browning: z.string(),
});
export type BreadMessage = z.infer<typeof BreadMessageSchema>;
export const BrownieMessageSchema = z.object({
  __typename: z.literal('Brownie'),
  test: z.string(),
});
export type BrownieMessage = z.infer<typeof BrownieMessageSchema>;

const Schema = {
  Test: TestMessageSchema,
  Bread: BreadMessageSchema,
  Brownie: BrownieMessageSchema,
};

export type SchemaKeys = keyof typeof Schema;

export default Schema;
