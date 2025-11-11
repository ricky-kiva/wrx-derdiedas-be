import 'reflect-metadata';

import mongoose from 'mongoose';
import connectToDatabase from '../../database/mongoose/connection';
import UserModel from '../../database/mongoose/models/UserModel';
import UserRepositoryMongo from '../UserRepositoryMongo';
import UsersCollectionTestHelper from '../../../../tests/UsersCollectionTestHelper';
import { UserPayload } from '../../../domains/user/entities/User';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('UserRepositoryMongo', () => {
  let userRepositoryMongo: UserRepositoryMongo;

  const payload = UsersCollectionTestHelper.getPayloads()[0];

  beforeAll(async() => {
    await connectToDatabase();
    userRepositoryMongo = new UserRepositoryMongo(UserModel);
  });

  afterEach(async () => {
    await UsersCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a user & return domain entity', async () => {
      const user = await userRepositoryMongo.create(payload);

      expect(user).toMatchObject({
        name: payload.name,
        googleId: payload.googleId,
        email: payload.email,
        picture: payload.picture
      } satisfies UserPayload );

      const doc = await UserModel.findById(user.id);
      
      expect(doc).not.toBeNull();
      expect(doc?._id.toString()).toEqual(user.id);
      expect(doc?.name).toBe(payload.name);
      expect(doc?.googleId).toBe(payload.googleId);
    });
  });

  describe('delete', () => {
    it('should delete user by id', async () => {
      const created = await UserModel.create(payload);
      const existing = await UserModel.findById(created._id);

      expect(existing).not.toBeNull();

      await userRepositoryMongo.delete(created._id.toString());

      const deleted = await UserModel.findById(created._id);

      expect(deleted).toBeNull();
    });

    it('should not throw if user does not exist', async () => {
      const nonexistentId = new mongoose.Types.ObjectId().toString();
      await expect(userRepositoryMongo.delete(nonexistentId)).resolves.not.toThrow();
    });
  });

  describe('findById', () => {
    it('should find user by Id', async () => {
      const createdDoc = await UserModel.create(payload);

      const found = await userRepositoryMongo.findById(createdDoc._id.toString());

      expect(found).not.toBeNull();
      expect(found?.id).toEqual(createdDoc._id.toString());
      expect(found?.name).toBe(payload.name);
      expect(found?.googleId).toBe(payload.googleId);
    });
  });

  describe('findByGoogleId', () => {
    it('should find User by googleId', async () => {
      if (!payload.googleId) throw new Error('Test Payload missing googleId');

      const createdDoc = await UserModel.create(payload);
      const found = await userRepositoryMongo.findByGoogleId(payload.googleId);

      expect(found).not.toBeNull();
      expect(found?.id).toEqual(createdDoc._id.toString());
    });
  });

  describe('findByName', () => {
    it('should find user by name', async () => {
      const createdDoc = await UserModel.create(payload);
      const found = await userRepositoryMongo.findByName(payload.name);

      expect(found).not.toBeNull();
      expect(found?.id).toEqual(createdDoc.id);
    });
  });

  describe('updateName', () => {
    it('should update user name by id', async () => {
      const createdDoc = await UserModel.create(payload);
      const newName = 'UpdatedName';

      await userRepositoryMongo.updateName(createdDoc._id.toString(), newName);

      const updatedDoc = await UserModel.findById(createdDoc._id);

      expect(updatedDoc).not.toBeNull();
      expect(updatedDoc?.name).toBe(newName);
    });

    it('should not throw if user id does not exist', async () => {
      const nonexistentId = new mongoose.Types.ObjectId().toString();

      await expect(userRepositoryMongo.updateName(nonexistentId, 'SomeName'))
        .resolves.not.toThrow();
    });
  });
});
