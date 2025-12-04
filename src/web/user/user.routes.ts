import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './user.controller.js';
import schema from './user.swagger.js';

async function userRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.patch(
    '/update/:id',
    {
      onRequest: [fastify.authenticateUserAccess],
      schema: schema.updateUser,
    },
    controller.updateUser,
  );
  fastify.get(
    '/list',
    { onRequest: [fastify.authenticateUserAccess], schema: schema.userList },
    controller.userList,
  );

  // fastify.post(
  //   '/logout',
  //   {
  //     schema: schema.logout,
  //     // onRequest: [fastify.authenticateAccess],
  //   },
  //   controller.logout
  // );
}

export default userRoutes;
