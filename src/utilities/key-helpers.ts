export function getKeysPattern(
  userId: string,
) {
  return `USER:${userId}*`;
}

export function getAccessTokenKey(
  userId: string,
  token: string,
) {
  return `USER:${userId}:ACCESS_TOKEN:${token}`;
}

export function getRefreshTokenKey(
  userId: string,
  token: string,
) {
  return `USER:${userId}:REFRESH_TOKEN:${token}`;
}
