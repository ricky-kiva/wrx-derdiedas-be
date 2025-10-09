import 'reflect-metadata';
import { schedule } from 'node-cron';
import { container } from 'tsyringe';
import DecayPointsUseCase from '../../../applications/use-cases/game/decay-points/DecayPointsUseCase';
import decayPointsCron from '../decayPointsCron';
import { DITokens } from '../../../commons/DITokens';

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

describe('decayPointsCron', () => {
  const mockDPUCExecute = jest.fn<Promise<void>, []>(() => Promise.resolve());

  const mockDecayPointsUseCase: DecayPointsUseCase = {
    execute: mockDPUCExecute 
  } as unknown as DecayPointsUseCase;

  beforeEach(() => {
    jest.spyOn(container, 'resolve').mockReturnValue(mockDecayPointsUseCase);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should schedule decay job and execute DecayPointsUseCase', async () => {
    decayPointsCron();

    expect(schedule).toHaveBeenCalledWith('30 2 * * *', expect.any(Function));

    const scheduleMock = schedule as jest.MockedFunction<typeof schedule>;
    const maybeTaskFn = scheduleMock.mock.calls[0][1];
    const scheduledFn = maybeTaskFn as () => Promise<void>;

    await scheduledFn();

    expect(container['resolve']).toHaveBeenCalledWith(DITokens.DecayPointsUseCase);
    expect(mockDPUCExecute).toHaveBeenCalledTimes(1);
  });

  it('should log an error if DecayPointsUseCase.execute throws', async () => {
    const testError = new Error('test failure');

    mockDPUCExecute.mockRejectedValueOnce(testError);

    decayPointsCron();

    const scheduleMock = schedule as jest.MockedFunction<typeof schedule>;
    const maybeTaskFn = scheduleMock.mock.calls[0][1];
    const scheduledFn = maybeTaskFn as () => Promise<void>;

    await scheduledFn();

    expect(console.error).toHaveBeenCalledWith(expect.any(String), testError);
  });
});
