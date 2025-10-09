import 'reflect-metadata';

import mongoose from 'mongoose';
import UserPointsCollectionTestHelper from '../../../../tests/UserPointsCollectionTestHelper';
import UsersCollectionTestHelper from '../../../../tests/UsersCollectionTestHelper';
import connectToDatabase from '../../database/mongoose/connection';
import UserPointModel from '../../database/mongoose/models/UserPointModel';
import { UserPointPayload } from '../../../domains/userPoint/entities/UserPoint';
import UserPointQueryRepositoryMongo from '../UserPointQueryRepositoryMongo';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('UserPointQueryRepositoryMongo', () => {
  let userPointQueryRepositoryMongo: UserPointQueryRepositoryMongo;

  beforeAll(async () => {
    await connectToDatabase();
    userPointQueryRepositoryMongo = new UserPointQueryRepositoryMongo(UserPointModel);
  });

  afterEach(async () => {
    await UserPointsCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await UsersCollectionTestHelper.cleanCollection();
    await mongoose.connection.close();
    
    jest.restoreAllMocks();
  });

  describe('findAll', () => {
    it('should return an empty array if no UserPoints exist', async () => {
      const result = await userPointQueryRepositoryMongo.findAll();
      expect(result).toEqual([]);
    });

    it('should return all UserPoints if documents exist', async () => {
      const payloads: UserPointPayload[] = UserPointsCollectionTestHelper.getPayloads();

      await UserPointModel.insertMany(payloads);

      const result = await userPointQueryRepositoryMongo.findAll();

      expect(result).toHaveLength(payloads.length);
      expect(result[0]).toHaveProperty('userId', payloads[0].userId);
      expect(result[0]).toHaveProperty('point', payloads[0].point);
    });
  });


  describe('findByUserId', () => {
    it('should return null if user point is not found', async () => {
      const nonexistentUserId = new mongoose.Types.ObjectId().toString();

      const result = await userPointQueryRepositoryMongo.findByUserId(nonexistentUserId);

      expect(result).toBeNull();
    });

    it('should return a UserPoint if found', async () => {
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayloads()[0];

      await UserPointModel.create(payload);

      const result = await userPointQueryRepositoryMongo.findByUserId(payload.userId);

      expect(result).not.toBeNull();
      expect(result?.userId).toBe(payload.userId);
      expect(result?.point).toBe(payload.point);
    });
  });
});
