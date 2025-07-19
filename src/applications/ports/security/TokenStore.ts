export default interface TokenStore {
  storeRefreshToken(userId: string, token: string, ttlSeconds?: number): Promise<void>;
  verifyStoredRefreshToken(userId: string, token: string): Promise<void>;
  deleteRefreshToken(userId: string): Promise<void>;
}
