import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './auth.controller.js';
import schema from './auth.swagger.js';

async function authRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.post('/signup', { schema: schema.signup }, controller.signup);
  fastify.post('/signin', { schema: schema.signin }, controller.signin);
}

export default authRoutes;
