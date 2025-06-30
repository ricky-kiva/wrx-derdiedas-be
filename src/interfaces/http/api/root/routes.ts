import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import RootHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function rootRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<RootHandler>(DITokens.RootHandler);
  
  r.get('/', (req, res) => h.getServiceInfo(req, res));

  return r;
}
