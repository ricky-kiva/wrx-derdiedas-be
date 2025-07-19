export default interface TokenStore {
  storeRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<void>;
  verifyRefreshToken(userId: string, token: string): Promise<void>;
  deleteRefreshToken(userId: string): Promise<void>;
}
