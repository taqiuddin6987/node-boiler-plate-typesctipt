import type { Static } from '@sinclair/typebox';
import type { FastifyRequest } from 'fastify';
import type schema from './auth.swagger.js';
import * as model from '#repositories/auth.repository';
import { CustomError } from '#utilities/custom-error.js';
import { getSha256Hash } from '#utilities/hash.js';
import HTTP_STATUS from '#utilities/http-status-codes';
import { getAccessTokenKey, getRefreshTokenKey } from '#utilities/key-helpers.js';
import { promiseHandler } from '#utilities/promise-handler';
import { parse } from '@lukeed/ms';

async function signup(request: FastifyRequest<{
  Body: Static<typeof schema.signup.body>;
}>) {
  const newPassword = await request.bcrypt.hash(request.body.password);
  const data = {
    ...request.body,
    password: newPassword,
  };
  const promise = model.signup(request.kysely, data);

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

async function signin(request: FastifyRequest<{
  Body: Static<typeof schema.signin.body>;
}>) {
  const promise = model.getUserByEmail(request.kysely, request.body);

  const [error, result] = await promiseHandler(promise);
  if (!result) {
    const error_ = new CustomError(error.detail ?? error.message);
    error_.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw error_;
  }

  if (!result.isActive) {
    const error_ = new CustomError('User is not activate');
    error_.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw error_;
  }
  const isPasswordMatch = await request.bcrypt.compare(
    request.body.password,
    result.password,
  );

  if (!isPasswordMatch) {
    const error_ = new CustomError(`invalid credentials`);
    error_.code = HTTP_STATUS.UNAUTHORIZED;
    throw error_;
  }

  const { id } = result;

  const accessToken = request.jwt.userAccess.sign({
    id,
  });

  const refreshToken = request.jwt.userRefresh.sign({
    id,
  });

  const accessTokenHash = getSha256Hash(accessToken);

  const accessTokenKey = getAccessTokenKey(
    id,
    accessTokenHash,
  );
  const refreshTokenKey = getRefreshTokenKey(
    id,
    accessTokenHash,
  );

  const accessTokenExpiry
    = parse(request.config.USER_ACCESS_JWT_EXPIRES_IN) ?? 0;
  const refreshTokenExpiry
    = parse(request.config.USER_REFRESH_JWT_EXPIRES_IN) ?? 0;

  await request.kvStore.set(accessTokenKey, accessToken, accessTokenExpiry);
  await request.kvStore.set(refreshTokenKey, refreshToken, refreshTokenExpiry);

  // await verifyOTP(request, email, otp);
  // await removeOTP(request, email);
  // await getOTP(request, email);

  return {
    code: HTTP_STATUS.OK,
    data: { ...result, password: undefined, token: `${id}:${accessTokenHash}` },
    message: 'signed in successfully.',
  };
}

export default {
  signin,
  signup,
};
