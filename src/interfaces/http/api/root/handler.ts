import { injectable } from 'tsyringe';
import { ServiceInfoResponse } from '../../types/ServiceInfoResponse';
import { Request, Response } from 'express';

@injectable()
export default class RootHandler {
  constructor() {
    this.getServiceInfo = this.getServiceInfo.bind(this);
  }

  getServiceInfo(_req: Request, res: Response) {
    res.json({
      status: 'success',
      service: 'derdiedas_be',
      version: '1.0.0',
      message: 'Shine on you crazy diamond!'
    } satisfies ServiceInfoResponse);
  }
}
