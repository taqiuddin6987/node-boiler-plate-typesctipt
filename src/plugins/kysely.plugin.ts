import type { DB } from '#src/types/database';
import type { FastifyInstance } from 'fastify';
import type { PoolConfig } from 'pg';
import fastifyPlugin from 'fastify-plugin';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

const { Pool } = pg;

async function fastifyKysely(fastify: FastifyInstance, options: PoolConfig) {
  const dialect = new PostgresDialect({
    pool: new Pool(options),
  });
  const database = new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
  fastify.decorate('kysely', database).addHook('onClose', async (instance) => {
    /* istanbul ignore else */
    if (instance.kysely === database) {
      instance.kysely.destroy();
    }
  });
  fastify.addHook('onRequest', async (request) => {
    request.kysely = fastify.kysely;
  });
}

export default fastifyPlugin(fastifyKysely, {
  name: 'fastify-kysely',
});

declare module 'fastify' {
  interface FastifyInstance {
    kysely: Kysely<DB>;
  }
  interface FastifyRequest {
    kysely: Kysely<DB>;
  }
}
