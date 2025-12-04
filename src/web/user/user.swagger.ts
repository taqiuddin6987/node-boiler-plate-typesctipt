/**
 * @typedef {import('json-schema').JSONSchema7} JSONSchema
 */

import { PaginationQuerySchema, SearchQuerySchema } from '#schemas/common.schema';
import { Type } from '@sinclair/typebox';

const swagger = {
  logout: {
    operationId: 'userSignOut',
    body: Type.Object(
      {
        invalidateAllTokens: Type.Boolean(),
      },
      { additionalProperties: false },
    ),
    description: 'this will sign out user',
    security: [{ AuthorizationUserAccess: [] }],
    summary: 'sign out user',
    tags: ['WEB|User'],
  },
  updateUser: {
    operationId: 'userUpdate',
    body: Type.Object({
      avatar: Type.Union([
        Type.Any({ isFile: true }),
        Type.Null(),
      ]),
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
    consumes: ['multipart/form-data'],
    description: 'this will update in user',
    params: Type.Object(
      {
        id: Type.String({ format: 'uuid' }),
      },
      { additionalProperties: false },
    ),
    security: [{ AuthorizationUserAccess: [] }],
    summary: 'update in user',
    tags: ['WEB|User'],
  },
  userList: {
    operationId: 'useList',
    description: 'this will list users',
    querystring: Type.Composite([PaginationQuerySchema, SearchQuerySchema], { additionalProperties: false }),
    security: [{ AuthorizationUserAccess: [] }],
    summary: 'list user',
    tags: ['WEB|User'],
  },
};

export default swagger;
