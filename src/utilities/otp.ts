import type { FastifyRequest } from 'fastify';
import { HOUR_IN_MS } from '#utilities/time-constants';

const OPT_KEY = (key: any) => `OTP_KEY:${key}`;

export async function getOTP(request: FastifyRequest, email: string) {
  const kysely = request.kysely;
  const findOne = await kysely
    .selectFrom('tokens')
    .where('key', '=', OPT_KEY(email))
    .executeTakeFirst();

  if (findOne) {
    removeOTP(request, email);
  }
  const OTP = Math.floor(1000 + Math.random() * 9000).toString();
  const object = {
    expiresAt: Date.now() + HOUR_IN_MS,
    hashedOTP: await request.bcrypt.hash(OTP),
  };
  const kvStore = request.kvStore;
  await kvStore.set(OPT_KEY(email), object, Date.now() + HOUR_IN_MS);
  return OTP;
}

export async function verifyOTP(request: FastifyRequest, email: string, otp: any) {
  const kvStore = request.kvStore;
  const query = await kvStore.get<{
    expiresAt: number;
    hashedOTP: string;
  }>(OPT_KEY(email));
  if (!query || query.expiresAt < Date.now()) {
    return false;
  }
  return await request.bcrypt.compare(otp, query.hashedOTP);
}

export async function removeOTP(request: FastifyRequest, email: string) {
  const kvStore = request.kvStore;
  await kvStore.del(OPT_KEY(email));
}
