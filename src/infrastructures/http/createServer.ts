import express from 'express';
import searchNounRoutes from '../../interfaces/http/api/search/routes';
import { DependencyContainer } from 'tsyringe';
import errorPreResponse from '../../interfaces/http/middlewares/error/errorPreResponse';
import cors from '../../interfaces/http/middlewares/cors/cors';
import rootRoutes from '../../interfaces/http/api/root/routes';
import helmet from '../../interfaces/http/middlewares/helmet/helmet';
import notFound from '../../interfaces/http/middlewares/notFound/notFound';
import { DITokens } from '../../commons/DITokens';
import LogMW from '../../interfaces/http/middlewares/log/LogMW';
import authRoutes from '../../interfaces/http/api/auth/routes';
import leaderboardRoutes from '../../interfaces/http/api/leaderboard/routes';
import gameRoutes from '../../interfaces/http/api/game/route';
import cookieParser from 'cookie-parser';

const createServer = (c: DependencyContainer) => {
  const app = express();
  const logger = c.resolve<LogMW>(DITokens.LogMW);

  app.set('trust proxy', true);

  app.use(cookieParser());
  app.use(cors);
  app.use(express.json());
  app.use(helmet);
  app.use(logger.logRequest);

  app.use('/', rootRoutes(c));
  app.use('/auth', authRoutes(c));
  app.use('/game', gameRoutes(c));
  app.use('/leaderboard', leaderboardRoutes(c));
  app.use('/search', searchNounRoutes(c));

  app.use(notFound);
  app.use(logger.logError);
  app.use(errorPreResponse);

  return app;
};

export default createServer;
