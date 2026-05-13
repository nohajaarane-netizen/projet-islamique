/**
 * Global Error Handler Middleware
 * Standardized error responses with i18n support
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public language: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    language: string = 'fr'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.language = language;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error messages in multiple languages
 */
const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  fr: {
    INTERNAL_ERROR: 'Une erreur interne est survenue',
    NOT_FOUND: 'Ressource non trouvée',
    VALIDATION_ERROR: 'Données invalides',
    UNAUTHORIZED: 'Non autorisé',
    FORBIDDEN: 'Accès interdit',
    BAD_REQUEST: 'Requête invalide',
    CONFLICT: 'Conflit de données',
    RATE_LIMIT: 'Trop de requêtes',
    SERVICE_UNAVAILABLE: 'Service temporairement indisponible',
  },
  en: {
    INTERNAL_ERROR: 'An internal error occurred',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Invalid data',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    BAD_REQUEST: 'Bad request',
    CONFLICT: 'Data conflict',
    RATE_LIMIT: 'Too many requests',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  },
  ar: {
    INTERNAL_ERROR: 'حدث خطأ داخلي',
    NOT_FOUND: 'المورد غير موجود',
    VALIDATION_ERROR: 'بيانات غير صالحة',
    UNAUTHORIZED: 'غير مصرح',
    FORBIDDEN: 'وصول ممنوع',
    BAD_REQUEST: 'طلب غير صالح',
    CONFLICT: 'تعارض في البيانات',
    RATE_LIMIT: 'طلبات كثيرة جداً',
    SERVICE_UNAVAILABLE: 'الخدمة غير متوفرة مؤقتاً',
  },
};

/**
 * Get localized error message
 */
function getErrorMessage(code: string, language: string = 'fr'): string {
  const langMessages = ERROR_MESSAGES[language] || ERROR_MESSAGES.fr;
  return langMessages[code] || langMessages.INTERNAL_ERROR;
}

/**
 * Global error handler
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message: string;
  let language = 'fr';

  // Get language from request
  const acceptLang = req.headers['accept-language'] || req.headers['x-user-lang'];
  if (typeof acceptLang === 'string' && ['fr', 'en', 'ar'].includes(acceptLang)) {
    language = acceptLang;
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    language = err.language;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    // Prisma errors
    statusCode = 400;
    errorCode = 'DATABASE_ERROR';
    message = 'Database operation failed';
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
  } else {
    message = err.message || getErrorMessage('INTERNAL_ERROR', language);
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`Error ${errorCode}:`, err);
  } else {
    logger.warn(`Client error ${errorCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code: errorCode,
    data: null,
    meta: {
      timestamp: new Date().toISOString(),
      language,
    },
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  const language = (req.headers['accept-language'] as string) || 'fr';

  res.status(404).json({
    success: false,
    message: getErrorMessage('NOT_FOUND', language),
    code: 'NOT_FOUND',
    data: null,
    meta: {
      timestamp: new Date().toISOString(),
      language,
    },
  });
}

export default { errorHandler, notFoundHandler, ApiError };
