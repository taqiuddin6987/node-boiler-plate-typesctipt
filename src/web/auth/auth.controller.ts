import type { FastifyReply, FastifyRequest } from 'fastify';
import { promiseHandler } from '#utilities/promise-handler';
import service from './auth.service';

function wrap(callback: any) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const log = request.log;

    // log.info("This is a log message");
    log.trace(`RequestId:: ${request.id}\nHandling ${request.method} ${request.url} Route`);
    const [error, result] = await promiseHandler(callback(request));
    if (error) {
      log.trace(
        `RequestId:: ${request.id}\nHandling Completed With Error On ${request.method} ${request.url} Route`,
      );
      log.error(
        `${error.message}\nRequestId:: ${request.id}\nTrace:: ${error.stack}`,
      );

      return reply.status(error.code).send({
        code: error.code,
        message: error.message,
        statusCode: error.code,
        success: false,
      });
    }

    log.trace(
      `RequestId:: ${request.id}\nHandling Completed With Success On ${request.method} ${request.url} Route`,
    );

    return reply.status(result.code).send({
      code: result.code,
      data: result.data,
      message: result.message,
      statusCode: result.code,
      success: true,
    });
  };
}

export default {
  signin: wrap(service.signin),
  signup: wrap(service.signup),
};
