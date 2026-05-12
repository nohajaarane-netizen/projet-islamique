/**
 * Request Validation Middleware
 * Zod schema validation for body, query, and params
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Validate request body against Zod schema
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
        }));

        logger.warn('Validation error:', issues);

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          data: { issues },
          meta: {
            timestamp: new Date().toISOString(),
            language: 'fr',
          },
        });
        return;
      }
      next(error);
    }
  };
}

/**
 * Validate request query against Zod schema
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.query);
      req.query = result as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Query validation failed',
          code: 'VALIDATION_ERROR',
          data: { issues },
          meta: {
            timestamp: new Date().toISOString(),
            language: 'fr',
          },
        });
        return;
      }
      next(error);
    }
  };
}

/**
 * Validate request params against Zod schema
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.params);
      req.params = result as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Params validation failed',
          code: 'VALIDATION_ERROR',
          data: { issues },
          meta: {
            timestamp: new Date().toISOString(),
            language: 'fr',
          },
        });
        return;
      }
      next(error);
    }
  };
}

export default { validateBody, validateQuery, validateParams };
