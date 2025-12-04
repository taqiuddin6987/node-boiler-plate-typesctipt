import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.routes';

async function webRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(userRoutes, { prefix: '/user' });
}

export default webRoutes;
