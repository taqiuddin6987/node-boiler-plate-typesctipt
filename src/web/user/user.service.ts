import type { Static } from '@sinclair/typebox';
import type { FastifyRequest } from 'fastify';
import type schema from './user.swagger.js';
import * as model from '#repositories/user.repository';
import { CustomError } from '#utilities/custom-error.js';
import HTTP_STATUS from '#utilities/http-status-codes';
import { promiseHandler } from '#utilities/promise-handler';
import uploadFile from '#utilities/uploadFile';

async function updateUser(request: FastifyRequest<{
  Body: Static<typeof schema.updateUser.body>;
  Params: Static<typeof schema.updateUser.params>;
}>) {
  if (request.body.avatar) {
    const file = uploadFile(request.body.avatar, 'profile');
    const [error, result] = await promiseHandler(file);
    if (!result) {
      const error_ = new CustomError(error.detail ?? error.message);
      error_.code = error.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
      throw error_;
    }
    request.body.avatar = result;
  }
  const promise = model.update(request.kysely, {
    ...request.body,
    id: request.params.id,
  });

  const [error, result] = await promiseHandler(promise);
  if (!result) {
    const error_ = new CustomError(error.detail ?? error.message);
    error_.code = error.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw error_;
  }

  return {
    code: HTTP_STATUS.OK,
    data: result,
    message: 'signed in successfully.',
  };
}

async function userList(request: FastifyRequest<{
  Querystring: Static<typeof schema.userList.querystring>;
}>) {
  const [error, result] = await promiseHandler(model.getUsers(request.kysely, request.query));
  if (!result) {
    const error_ = new CustomError(error?.detail ?? error?.message ?? 'User not found');
    error_.code = error?.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw error_;
  }

  return {
    code: HTTP_STATUS.OK,
    data: { ...result },
    message: 'Users has been fetched successfully',
  };
}

export default {
  updateUser,
  userList,
};
