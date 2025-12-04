import type { FastifyKyselyKVStoreOptions } from '#plugins/kysely-kv.plugin';

function kyselyKVConfig(): FastifyKyselyKVStoreOptions {
  return {
    schema: 'public',
    table: 'tokens',
    useUnloggedTable: true,
  };
}

export default kyselyKVConfig;
