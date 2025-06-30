import express from 'express';
import searchNounRoutes from '../../interfaces/http/api/searchNoun/routes';
import { DependencyContainer } from 'tsyringe';
import errorPreResponse from '../../interfaces/http/middlewares/error/errorPreReponse';

import cors from '../../interfaces/http/middlewares/cors/cors';
import rootRoutes from '../../interfaces/http/api/root/routes';
import helmet from '../../interfaces/http/middlewares/helmet/helmet';

const createServer = (c: DependencyContainer) => {
  const app = express();

  // TO DO: Swagger API documentation
  // TO DO: Winston logging

  app.use(cors);
  app.use(helmet);
  app.use(express.json());

  app.use('/', rootRoutes(c));
  app.use('/search', searchNounRoutes(c));  

  app.use(errorPreResponse);

  return app;
};

export default createServer;
