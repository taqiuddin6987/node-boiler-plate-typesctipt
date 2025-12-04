import type { DB } from '#src/types/database';
import type { Kysely } from 'kysely';
import getConflicts from '#utilities/get-conflicts';
import HTTP_STATUS from '#utilities/http-status-codes';
import { getLimitAndOffset, getPaginationObject } from '#utilities/pagination-helpers';
import { POSTGRES_ERROR_CODES } from '#utilities/postgres_error_codes';
import { promiseHandler } from '#utilities/promise-handler';
import createError from '@fastify/error';

const NotFoundError = createError(
  'USER_ID_NOT_FOUND',
  'User with id \'%s\' does not exist',
  HTTP_STATUS.NOT_FOUND,
);

// const EmailNotFoundError = createError(
//   'USER_EMAIL_NOT_FOUND',
//   'USer with email \'%s\' does not exist',
//   HTTP_STATUS.NOT_FOUND,
// );

export async function update(
  kysely: Kysely<DB>,
  data: {
    id: string;
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
  },
) {
  const query = kysely
    .updateTable('users')
    .set({
      avatar: data.avatar,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      password: data.password,
      phone: data.phone,
    })
    .where('id', '=', data.id)
    .returning(['id', 'name', 'email', 'phone'])
    .executeTakeFirst();

  const [error, result, ok] = await promiseHandler(query);
  if (!ok) {
    if (error.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
      const conflicts = getConflicts(error.detail);
      throw new NotFoundError(conflicts.task);
    }
    throw error;
  }
  if (!result) {
    throw new NotFoundError(data.id);
  }
  const record = result;
  return { record };
}

export async function getUserById(
  kysely: Kysely<DB>,
  data: {
    id: string;
  },
) {
  // const promise = kysely
  //   .selectFrom('users')
  //   .where('users.id', '=', data.id)
  //   .leftJoin('file', 'file.id', 'users.id')
  //   .select(eb => [
  //     'users.email',
  //     'users.id',
  //     'users.name',
  //     'users.password',
  //     'users.phone',
  //     'users.isActive',
  //     'users.isDeleted',
  //     fileJsonExpression(eb).as('image'),
  //   ])
  //   .executeTakeFirst();

  const promise = kysely
    .selectFrom('users')
    .where('users.id', '=', data.id)
    .leftJoin('file', 'file.id', 'users.id')
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
    throw new NotFoundError(data.id);
  }

  return result;
}

export async function getUsers(
  kysely: Kysely<DB>,
  data: {
    page: number;
    search?: string;
    size: number;
  },
) {
  const [limit, offset] = getLimitAndOffset({
    page: data.page,
    size: data.size,
  });

  const query = kysely
    .selectFrom('users')
    .$if(Boolean(data.search), (qb) => {
      if (!data.search || !data.search.trim())
        return qb;
      const searchText = `%${data.search.replaceAll(/[%_]/g, String.raw`\$&`)}%`;
      return qb.where('name', 'ilike', searchText);
    });

  const countQuery = query
    .select(eb => eb.fn.countAll().as('total'))
    .executeTakeFirstOrThrow();

  const filteredQuery = query
    .select(['id', 'name', 'email', 'phone', 'avatar'])
    .orderBy('createdAt', 'desc')
    .offset(offset)
    .limit(limit)
    .execute();

  const [error, result, ok] = await promiseHandler(
    Promise.all([filteredQuery, countQuery]),
  );

  if (!ok) {
    throw error;
  }

  const [records, { total }] = result;

  const pagination = getPaginationObject({
    page: data.page,
    size: data.size,
    total: Number(total),
  });

  return {
    pagination,
    records,
  };
}
