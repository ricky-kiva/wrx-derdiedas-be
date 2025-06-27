import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export default function zodParser(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e: unknown) {
      next(e);
    }
  };
}
