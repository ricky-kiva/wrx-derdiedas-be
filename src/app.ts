import 'reflect-metadata';

import container from './infrastructures/container';
import createServer from './infrastructures/http/createServer';
import config from './commons/config';
import NounSearchService from './applications/ports/search/NounSearchService';
import { DITokens } from './commons/DITokens';
import connectToDatabase from './infrastructures/database/mongoose/connection';
import NounSeeder from './infrastructures/database/bootstrap/NounSeeder';
import GameExpirationListener from './infrastructures/database/redis/listeners/game/GameExpirationListener';
import decayPointsCron from './infrastructures/cron/decayPointsCron';

const start = async () => {
  const app = createServer(container);

  const nounSearchService = container.resolve<NounSearchService>(DITokens.NounSearchService);
  const nounSeeder = container.resolve<NounSeeder>(DITokens.NounSeeder);
  const gameExpirationListener = container.resolve<GameExpirationListener>(DITokens.GameExpirationListener);

  const { host, port } = config.app;

  await connectToDatabase();
  await nounSeeder.seed();
  await nounSearchService.initialize();
  await gameExpirationListener.start();

  decayPointsCron();
    
  app.listen(port, host, () => {
    console.log(`Server is starting at http://${host}:${port}`);
  });
};

start().catch((e) => {
  console.error(`Failed to start server: ${e}`);
  process.exit(1);
});
