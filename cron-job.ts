import type { FastifyInstance } from 'fastify';
import { CronJob } from 'cron';
import { expiredTokens } from './cron_job/tokens.job';

export function startCron(server: FastifyInstance) {
  // Every day at 2 pm.
  // '0 0 2 * * *'
  CronJob.from({
    // cronTime: "0 0 */14 * * *",
    // cronTime: "*/10 * * * *",
    cronTime: '0 0 14 * * *',
    // cronTime: '* * * * * *',
    onTick: () => {
      expiredTokens(server.kysely);
    },
    start: true,
  });
}
