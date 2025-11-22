export default interface TokenStore {
  storeRefreshToken(userId: string, token: string, ttlSeconds?: number): Promise<void>;
  verifyStoredRefreshToken(userId: string, token: string): Promise<boolean>;
  deleteRefreshToken(userId: string): Promise<void>;
}
