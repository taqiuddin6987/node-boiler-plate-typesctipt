import type { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(database: Kysely<any>): Promise<void> {
  await database.schema
    .createTable('users')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('first_name', 'text', col => col.notNull())
    .addColumn('last_name', 'text', col => col.notNull())
    .addColumn('password', 'text', col => col.notNull())
    .addColumn('email', 'text', col => col.notNull())
    .addColumn('phone', 'varchar(25)', col => col.notNull())
    .addColumn('gender', 'text')
    .addColumn('address', 'text')
    .addColumn('dob', 'timestamptz')
    .addColumn('avatar', 'text')
    .addColumn('is_active', 'boolean', col => col.defaultTo(true).notNull())
    .addColumn('is_deleted', 'boolean', col => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('updated_at', 'timestamptz', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    // .addColumn('file_id', 'uuid', col =>
    //   col.references('file.id').onDelete('set null'))
    .addUniqueConstraint('email_unique', ['email'])
    .addUniqueConstraint('phone_unique', ['phone'])
    .execute();

  // await database.schema
  //   .createIndex('users_image_file_id_index')
  //   .on('users')
  //   .column('file_id')
  //   .execute();
}

export async function down(database: Kysely<any>): Promise<void> {
  await database.schema.dropTable('users').execute();
}
