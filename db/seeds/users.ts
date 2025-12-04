import type { DB } from '#src/types/database';
import type { Kysely } from 'kysely';
import bcrypt from 'bcrypt';

export async function seed(database: Kysely<DB>) {
  const salt = bcrypt.genSaltSync(12);
  const password = await bcrypt.hash('12345678', salt);

  await database
    .insertInto('users')
    .values({
      email: 'admin@gmail.com',
      name: 'Syed Taqiuddin',
      password,
      phone: '03001234567',
    })
    .execute();

  await database.destroy();
}
