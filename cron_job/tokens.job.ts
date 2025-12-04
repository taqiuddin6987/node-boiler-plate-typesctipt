import type { DB } from '#src/types/database';
import type { Kysely } from 'kysely';

export async function expiredTokens(database: Kysely<DB>) {
  await database
    .deleteFrom('tokens')
    .where('expiresAt', 'is not', null) // expiresAt IS NOT NULL
    .where('expiresAt', '<', new Date()) // no need sql.raw
    .execute();
}
