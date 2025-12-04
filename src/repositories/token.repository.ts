import type { DB } from '#src/types/database';
import type { Kysely } from 'kysely';
import HTTP_STATUS from '#utilities/http-status-codes';
import { promiseHandler } from '#utilities/promise-handler';
import createError from '@fastify/error';

const NotFoundError = createError(
  'USER_ID_NOT_FOUND',
  'User with id \'%s\' does not exist',
  HTTP_STATUS.NOT_FOUND,
);

export async function create(
  kysely: Kysely<DB>,
  data: {
    key: string;
    value: string;
  },
) {
  const query = kysely
    .insertInto('tokens')
    .values({
      key: data.key,
      value: data.value,
    })
    .returning(['key', 'value'])
    .executeTakeFirst();

  const [error, result, ok] = await promiseHandler(query);

  if (!ok) {
    throw error;
  }

  const record = result;

  return { record };
}

export async function getToken(
  kysely: Kysely<DB>,
  data: {
    key: string;
  },
) {
  const promise = kysely
    .selectFrom('tokens')
    .where('tokens.key', '=', data.key)
    .select(_eb => [
      'tokens.key',
      'tokens.value',
    ])
    .executeTakeFirst();

  const [error, result, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  if (!result) {
    throw new NotFoundError(data.key);
  }

  return result;
}

export async function deleteToken(
  kysely: Kysely<DB>,
  data: {
    key: string;
  },
) {
  const promise = kysely
    .deleteFrom('tokens')
    .where('tokens.key', '=', data.key)
    .execute();

  const [error, result, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  if (!result) {
    throw new NotFoundError(data.key);
  }

  return result;
}
