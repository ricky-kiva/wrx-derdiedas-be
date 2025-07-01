import { Request, Response } from 'express';
import ApiResponse from '../../types/ApiResponse';

const notFound = (_req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: 'route not found'
  } satisfies ApiResponse);
};

export default notFound;
