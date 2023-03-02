import fs from "fs";
import { CompositeGeneratorNode, NL, toString } from "langium";
import path from "path";
import {
  Model,
  PrimitiveType,
  TypeAssignment,
} from "../language-server/generated/ast";
import { extractDestinationAndName } from "./cli-util";

export function generateZod(
  model: Model,
  filePath: string,
  destination: string | undefined
): string {
  const data = extractDestinationAndName(filePath, destination);
  const generatedFilePath = `${path.join(data.destination, data.name)}.ts`;

  const fileNode = new CompositeGeneratorNode();
  fileNode.append("import { z } from 'zod';", NL, NL);

  const types = new Map<string, string>();

  model.type.forEach((type) => {
    const body = generateBody(type.body);
    types.set(
      type.name,
      `z.object({
        __typename : z.literal("${type.name}"),\n
        ${body.join(",")}
    })`
    );
  });

  types.forEach((value, key) => {
    fileNode.append(`const ${key} = ${value};`, NL);
  });

  const messages = new Map<string, string>();

  model.message.forEach((message) => {
    const body = generateBody(message.body);
    messages.set(
      message.name,
      `z.object({\n\t__typename : z.literal("${message.name}"),\n\t${body.join(
        ",\n\t"
      )}\n})`
    );
  });

  messages.forEach((value, key) => {
    fileNode.append(`export const ${key}MessageSchema = ${value};`, NL);
    fileNode.append(
      `export type ${key}Message = z.infer<typeof ${key}MessageSchema>;`,
      NL
    );
  });

  fileNode.append(NL, generateSchema(), NL, "export default Schema;");

  function generateSchema() {
    const schema = new CompositeGeneratorNode();
    schema.append("const Schema = {", NL);
    messages.forEach((_, key) => {
      schema.append(`\t${key}: ${key}MessageSchema,`, NL);
    });
    schema.append("};", NL);
    return schema;
  }

  if (!fs.existsSync(data.destination)) {
    fs.mkdirSync(data.destination, { recursive: true });
  }
  fs.writeFileSync(generatedFilePath, toString(fileNode));
  return generatedFilePath;
}

function generateBody(body: TypeAssignment[]) {
  return body.map((assignment) => {
    if (assignment.type) {
      return `${assignment.name}: ${generatePrimitiveType(assignment.type)}`;
    } else if (assignment.typeRef) {
      return `${assignment.name}: ${assignment.typeRef.ref?.name}`;
    } else {
      throw new Error("Type or typeRef must be defined");
    }
  });
}

function generatePrimitiveType(type: PrimitiveType): string {
  switch (type.type) {
    case "boolean":
      return "z.boolean()";
    case "number":
      return "z.number()";
    case "string":
      return "z.string()";
  }
}
