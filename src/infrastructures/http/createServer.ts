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

const createServer = (c: DependencyContainer) => {
  const app = express();
  const logger = c.resolve<LogMW>(DITokens.LogMW);

  app.set('trust proxy', true);

  app.use(cors);
  app.use(helmet);
  app.use(express.json());
  app.use(logger.logRequest);

  app.use('/', rootRoutes(c));
  app.use('/search', searchNounRoutes(c));

  app.use(notFound);
  app.use(logger.logError);
  app.use(errorPreResponse);

  return app;
};

export default createServer;
