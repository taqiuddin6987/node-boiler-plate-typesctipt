import type { FastifyEnvOptions } from '@fastify/env';
import type { Static } from '@sinclair/typebox';
import type Ajv from 'ajv';
import { Type } from '@sinclair/typebox';

const ENV_SCHEMA = Type.Object({
  DATABASE_URL: Type.String(),
  STATIC_SERVE_FOLDER: Type.String(),
  STATIC_SERVE_PREFIX: Type.String(),
  USER_ACCESS_JWT_EXPIRES_IN: Type.String(),
  USER_ACCESS_JWT_SECRET: Type.String(),
  USER_REFRESH_JWT_EXPIRES_IN: Type.String(),
  USER_REFRESH_JWT_SECRET: Type.String(),
  VERSION: Type.String(),
  WEB_SERVER_BASE_URL: Type.String(),
  WEB_SERVER_BIND_ADDRESS: Type.String(),

  WEB_SERVER_PORT: Type.Integer({
    maximum: 65_535,
    minimum: 1000,
  }),
});

export type ENVSchemaType = Static<typeof ENV_SCHEMA>;

function environmentConfig(): FastifyEnvOptions {
  return {
    ajv: {
      customOptions: (ajv: Ajv) => ajv.addSchema({ coerceTypes: true }),
    },
    confKey: 'config',
    dotenv: {
      path: `.env`,
    },
    schema: ENV_SCHEMA,
  };
}

export default environmentConfig;

declare module 'fastify' {
  interface FastifyInstance {
    config: ENVSchemaType;
  }
  interface FastifyRequest {
    config: ENVSchemaType;
  }
}
