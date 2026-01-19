import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validateRequest = (schema: ZodType<any, any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    return res.status(500).json({ message: 'Internal validation error' });
  }
};

export const validateQuery = (schema: ZodType<any, any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await schema.parseAsync(req.query);
    req.query = parsed;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    return res.status(500).json({ message: 'Internal validation error' });
  }
};
