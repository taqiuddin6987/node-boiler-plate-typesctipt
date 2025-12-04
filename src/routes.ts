import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import webRoutes from './web/web.routes';

async function routes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.register(webRoutes, { prefix: '/web' });
}

export default routes;
