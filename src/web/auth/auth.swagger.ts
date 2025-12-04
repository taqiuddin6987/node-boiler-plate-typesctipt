/**
 * @typedef {import('json-schema').JSONSchema7} JSONSchema
 */

import { Type } from '@sinclair/typebox';

const swagger = {
  signin: {
    operationId: 'userSignIn',
    body: Type.Object(
      {
        email: Type.String(),
        password: Type.String({ minLength: 2 }),
      },
      { additionalProperties: false },
    ),
    description: 'this will sign in user',
    summary: 'sign in user',
    tags: ['WEB|Auth'],
  },

  /** @type {JSONSchema} */
  signup: {
    operationId: 'userCreate',
    body: Type.Object({
      avatar: Type.Optional(Type.Union([
        Type.Any({ isFile: true }),
        Type.Null(),
      ])),
      email: Type.String({ description: 'email address', format: 'email' }),
      firstName: Type.String({
        description: 'full name of the user',
        examples: ['John Doe'],
      }),
      lastName: Type.String({
        description: 'full name of the user',
        examples: ['John Doe'],
      }),
      password: Type.String({ minLength: 2 }),
      phone: Type.String({
        description: 'phone number',
        examples: ['03001234567'],
      }),
    }, { additionalProperties: false }),
    consumeds: ['multipart/form-data'],
    description: 'this will create in user',
    summary: 'create in user',
    tags: ['WEB|Auth'],
  },
};

export default swagger;
