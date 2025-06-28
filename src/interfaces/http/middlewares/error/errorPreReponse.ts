import { Request, Response } from 'express';
import { ClientError, ServerError } from '../../../../commons/exceptions';
import ApiResponse from '../../types/ApiResponse';

export default function errorPreResponse(err: Error, _req: Request, res: Response) {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message
    } satisfies ApiResponse);
  }

  if (err instanceof ServerError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    } satisfies ApiResponse);  
  }

  return res.status(500).json({
    status: 'error',
    message: 'internal server error'
  } satisfies ApiResponse);
}
