import { UserIdParamSchema, GetUserPointParamSchema, DeleteUserParamSchema, UpdateUserNameParamsSchema, UpdateUserNamePayloadSchema } from '../schemas';

describe('User Schemas', () => {
  const validIdPayload = { id: 'user-123' };

  describe('UserIdParamSchema and its variants', () => {
    it('passes with valid id', () => {
      const result = UserIdParamSchema.safeParse(validIdPayload);
      expect(result.success).toBe(true);
    });

    it('fails when id is missing', () => {
      const result = UserIdParamSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('fails when id is empty', () => {
      const result = UserIdParamSchema.safeParse({ id: '' });
      expect(result.success).toBe(false);
    });

    it('GetUserPointParamSchema behaves same as UserIdParamSchema', () => {
      const result = GetUserPointParamSchema.safeParse(validIdPayload);
      expect(result.success).toBe(true);
    });

    it('DeleteUserParamSchema behaves same as UserIdParamSchema', () => {
      const result = DeleteUserParamSchema.safeParse(validIdPayload);
      expect(result.success).toBe(true);
    });

    it('UpdateUserNameParamsSchema behaves same as UserIdParamSchema', () => {
      const result = UpdateUserNameParamsSchema.safeParse(validIdPayload);
      expect(result.success).toBe(true);
    });
  });

  describe('UpdateUserNamePayloadSchema', () => {
    it('passes with valid name', () => {
      const payload = { name: 'Rickyslash' };
      const result = UpdateUserNamePayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('fails when name is missing', () => {
      const result = UpdateUserNamePayloadSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('fails when name is empty', () => {
      const result = UpdateUserNamePayloadSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });
  });
});
