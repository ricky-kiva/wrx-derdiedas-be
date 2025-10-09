import { container } from 'tsyringe';
import { DITokens } from '../../commons/DITokens';
import DecayPointsUseCase from '../../applications/use-cases/game/decay-points/DecayPointsUseCase';
import { schedule } from 'node-cron';

export default function decayPointsCron() {
  schedule('30 2 * * *', () => {
    void (async () => {
      console.log('[CRON] Decaying User Points..');

      const decayPointsUseCase = container.resolve<DecayPointsUseCase>(DITokens.DecayPointsUseCase);

      try {
        await decayPointsUseCase.execute();
        console.log('[CRON] Decaying User Points completed');
      } catch (e) {
        console.error('[CRON] Error executing decayPointsCron:', e);
      }
    })();
  });
}
