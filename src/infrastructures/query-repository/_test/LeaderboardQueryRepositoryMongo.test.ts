import 'reflect-metadata';
import { LeaderboardQueryRepositoryMongo } from '../LeaderboardQueryRepositoryMongo';
import connectToDatabase from '../../database/mongoose/connection';
import UserPointModel from '../../database/mongoose/models/UserPointModel';
import UserPointsCollectionTestHelper from '../../../../tests/UserPointsCollectionTestHelper';
import UsersCollectionTestHelper from '../../../../tests/UsersCollectionTestHelper';
import mongoose from 'mongoose';
import UserModel from '../../database/mongoose/models/UserModel';
import { LeaderboardEntryDTO } from '../../../applications/query-repositories/leaderboard/dto/LeaderboardEntryDTO';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('LeaderboardQueryRepositoryMongo', () => {
  let leaderboardQueryRepository: LeaderboardQueryRepositoryMongo;

  beforeAll(async () => {
    await connectToDatabase();
    leaderboardQueryRepository = new LeaderboardQueryRepositoryMongo(UserPointModel);
  });

  afterEach(async () => {
    await UserPointsCollectionTestHelper.cleanCollection();
    await UsersCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });

  it('should return paginated leaderboard with corrent fields & order', async () => {
    const userPayloads = UsersCollectionTestHelper.getPayloads();
    
    const users = await UserModel.insertMany(userPayloads);

    const userIds = users.map(u => u._id);

    const userPoints = UserPointsCollectionTestHelper.getUserPointsWithUserIds(userIds);

    await UserPointModel.insertMany(userPoints);

    const result = await leaderboardQueryRepository.getLeaderboard(1, 10);

    expect(result.items.length).toBe(userPoints.length);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);

    const resultItems = [ ...result.items ]; 

    resultItems.sort((a, b) => {
      if (b.point !== a.point) return b.point - a.point;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    resultItems.forEach((ri, i) => {
      expect(result.items[i]).toMatchObject<LeaderboardEntryDTO>(ri);
    });
  });

  it('should return empty array if no user exists', async () => {
    const result = await leaderboardQueryRepository.getLeaderboard(1, 10);

    expect(result.items).toEqual([]);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(0);
  });
});
