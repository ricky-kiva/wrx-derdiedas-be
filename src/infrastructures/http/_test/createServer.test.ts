import 'reflect-metadata';

import { DependencyContainer, container } from 'tsyringe';
import createServer from '../createServer';
import useCasesMockTestPart from './parts/mocks/useCases.mock.test.part';
import testSearchRoutes from './parts/routes/search.routes.test.part';
import testRootRoutes from './parts/routes/root.routes.test.part';
import testNotFoundMW from './parts/middlewares/notFound.mw.test.part';
import containerRegistersTestPart from './parts/container/registers.container.test.part';
import testErrorPreResponseMW from './parts/middlewares/errorPreResponse.mw.test.part';
import testAuthRoutes from './parts/routes/auth.routes.test.part';
import testLeaderboardRoutes from './parts/routes/leaderboard.routes.test.part';
import testGameRoutes from './parts/routes/game.routes.test.part';
import testUserRoutes from './parts/routes/user.routes.test.part';

describe('createServer', () => {
  let testContainer: DependencyContainer;
  let testMocks: ReturnType<typeof useCasesMockTestPart>;
  let app: ReturnType<typeof createServer>;

  beforeEach(() => {
    testContainer = container.createChildContainer();
    
    containerRegistersTestPart(testContainer);

    testMocks = useCasesMockTestPart(testContainer);
    app = createServer(testContainer);
  });

  afterEach(() => {
    testContainer.clearInstances();
  });

  testAuthRoutes(() => app, () => testMocks);
  testGameRoutes(() => app, () => testMocks);
  testLeaderboardRoutes(() => app, () => testMocks);
  testRootRoutes(() => app);
  testSearchRoutes(() => app, () => testMocks);
  testUserRoutes(() => app, () => testMocks);

  testNotFoundMW(() => app);
  testErrorPreResponseMW(() => testContainer);
});
