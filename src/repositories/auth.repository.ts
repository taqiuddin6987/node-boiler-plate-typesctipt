import type { DB } from '#src/types/database';
import type { Kysely } from 'kysely';
import HTTP_STATUS from '#utilities/http-status-codes';
import { promiseHandler } from '#utilities/promise-handler';
import createError from '@fastify/error';

// const NotFoundError = createError(
//   'USER_ID_NOT_FOUND',
//   'User with id \'%s\' does not exist',
//   HTTP_STATUS.NOT_FOUND,
// );

const EmailNotFoundError = createError(
  'USER_EMAIL_NOT_FOUND',
  'USer with email \'%s\' does not exist',
  HTTP_STATUS.NOT_FOUND,
);

export async function signup(
  kysely: Kysely<DB>,
  data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
  },
) {
  const query = kysely
    .insertInto('users')
    .values({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      password: data.password,
      phone: data.phone,
    })
    .returning(['id', 'name', 'email', 'phone'])
    .executeTakeFirst();

  const [error, result, ok] = await promiseHandler(query);

  if (!ok) {
    throw error;
  }

  const record = result;

  return { record };
}

export async function getUserByEmail(
  kysely: Kysely<DB>,
  data: {
    email: string;
  },
) {
  const promise = kysely
    .selectFrom('users')
    .where('users.email', '=', data.email)
    .select([
      'users.email',
      'users.id',
      'users.name',
      'users.password',
      'users.phone',
      'users.isActive',
      'users.isDeleted',
    ])
    .executeTakeFirst();

  const [error, result, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  if (!result) {
    throw new EmailNotFoundError(data.email);
  }

  return result;
}
