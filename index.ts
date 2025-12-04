import type Ajv from 'ajv';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import process from 'node:process';
import { bcryptConfig } from '#configs/bcrypt.config';
import envConfig from '#configs/environment.config';
import { JWTConfig } from '#configs/jwt.config';
import kyselyKVConfig from '#configs/kysely-kv.config';
import kyselyConfig from '#configs/kysely.config';
import { loggerConfig } from '#configs/logger.config';
import { multipartConfig } from '#configs/multipart.config';
import { staticServeConfig } from '#configs/static-serve.config';
import { swaggerConfig, swaggerUIConfig } from '#configs/swagger.config';
import fastifyBcrypt from '#plugins/bcrypt.plugin';
import fastifyJWT from '#plugins/jwt.plugin';
import fastifyKyselyKVStore from '#plugins/kysely-kv.plugin';
import fastifyKysely from '#plugins/kysely.plugin';
import fastifyLogger from '#plugins/logger.plugin';
import HTTP_STATUS from '#utilities/http-status-codes';
import { createLogger } from '#utilities/logger';
import fastifyCORS from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import fastifyFormbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import fastifyStaticServe from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { startCron } from './cron-job';
import routes from './src/routes';

process.env.TZ = 'UTC';

const ajvValidate = () => true;

function ajvFilePlugin(ajv: Ajv) {
  return ajv.addKeyword({
    compile: (_schema, parent) => {
      parent.type = 'file';
      delete parent.isFile;
      return ajvValidate;
    },
    keyword: 'isFile',
  });
}

const systemLogger = createLogger('SYSTEM_LOGGER');
const server = fastify({
  genReqId: () => crypto.randomUUID(),
  ajv: {
    customOptions: {
      allErrors: true,
      coerceTypes: 'array',
      keywords: ['collectionFormat'],
      removeAdditional: true,
      useDefaults: true,
    },
    plugins: [ajvFilePlugin],
  },
  loggerInstance: systemLogger,
});

await server.register(fastifyEnv, envConfig());

await server.addHook('onRequest', async (request, _reply) => {
  request.config = server.config;
});

await server.register(fastifyLogger, loggerConfig());

await server.register(fastifyCORS, { origin: '*' });

await server.register(helmet, {
  global: true,
});

await server.register(rateLimit, {
  max: 100, // 100 req / minute
  timeWindow: '1 minute',
});

await server.register(fastifyKysely, kyselyConfig(server.config));

await server.register(fastifyKyselyKVStore, kyselyKVConfig());

await server.register(fastifyFormbody);

await server.register(fastifyMultipart, multipartConfig());

await server.register(fastifyBcrypt, bcryptConfig());

await server.register(fastifyJWT, JWTConfig(server.config));

await server.register(fastifySwagger, swaggerConfig());

await server.register(fastifySwaggerUi, swaggerUIConfig());

await server.register(fastifyStaticServe, staticServeConfig(server.config));

await server.register(routes, { prefix: `/api/v1` });

server.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.send({
    message: 'server is running',
    statusCode: HTTP_STATUS.OK,
  });
});

server.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.send({
    status: 'ok',
    statusCode: 200,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // server uptime in seconds
    version: server.config.VERSION || '1.0.0',
  });
});

server.get('/health/full', async (_request: FastifyRequest, reply: FastifyReply) => {
  const checks = {
    cron: 'running',
    db: 'ok',
    memory: process.memoryUsage(),
    server: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  return reply.send({
    checks,
    status: 'healthy',
    statusCode: 200,
  });
});

await server.ready();

// console.log('server.printRoutes() :>>', server.printRoutes());

await server.listen({
  host: server.config.WEB_SERVER_BIND_ADDRESS,
  listenTextResolver: () => {
    const host
      = server.config.WEB_SERVER_BIND_ADDRESS === '0.0.0.0'
        ? 'localhost'
        : server.config.WEB_SERVER_BIND_ADDRESS;
    return `server is listening at http://${host}:${server.config.WEB_SERVER_PORT}`;
  },
  port: server.config.WEB_SERVER_PORT,
});

startCron(server as unknown as FastifyInstance);

function gracefulShutdown() {
  server.close(() => {
    server.log.info({ message: `Server is shutting down` });
    throw new Error('Server is shutting down');
  });
}
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
