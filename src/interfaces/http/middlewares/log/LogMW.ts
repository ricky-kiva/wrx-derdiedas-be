import 'reflect-metadata';

import os from 'os';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import LoggerService from '../../../../applications/ports/logger/LoggerService';
import { NextFunction, Request, Response } from 'express';

@injectable()
export default class LogMW {
  constructor(@inject(DITokens.LoggerService) private readonly logger: LoggerService) {
    this.logRequest = this.logRequest.bind(this);
    this.logError = this.logError.bind(this);
  }

  logRequest = (req: Request, _res: Response, next: NextFunction): void => {
    this.logger.info('Incoming request', this.buildRequestMeta(req));
    next();
  };

  logError = (err: Error, _req: Request, _res: Response, next: NextFunction): void => {
    this.logger.error(err.message, err);
    next(err);
  };

  private buildRequestMeta(req: Request): Record<string, unknown> {
    return {
      ip: req.ip,
      host: os.hostname(),
      method: req.method,
      path: req.path
    }; 
  }
}
