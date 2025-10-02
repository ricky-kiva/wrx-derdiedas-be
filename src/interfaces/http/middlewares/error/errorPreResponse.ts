import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ClientError, ServerError } from '../../../../commons/exceptions';
import ApiResponse from '../../types/ApiResponse';
import { ZodError } from 'zod';

const errorPreResponse: ErrorRequestHandler = (
  err: Error, 
  _req: Request, 
  res: Response, 
  _next: NextFunction
) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'fail',
      message: err.errors[0].message
    } satisfies ApiResponse);

    return;
  }

  if (err instanceof ClientError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message
    } satisfies ApiResponse);

    return;
  }

  if (err instanceof ServerError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    } satisfies ApiResponse);
    
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'internal server error'
  } satisfies ApiResponse);
};

export default errorPreResponse;
