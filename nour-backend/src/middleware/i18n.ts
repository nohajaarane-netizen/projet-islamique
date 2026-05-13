/**
 * Internationalization Middleware
 * Detects and sets user language preference
 */

import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export type SupportedLanguage = 'fr' | 'en' | 'ar';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['fr', 'en', 'ar'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'fr';

/**
 * Detect language from request
 * Priority: 1. User JWT, 2. Accept-Language header, 3. Query param, 4. Default
 */
export function i18nMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  let language: SupportedLanguage = DEFAULT_LANGUAGE;

  // 1. Check user preference from JWT
  if (req.user?.preferredLang && SUPPORTED_LANGUAGES.includes(req.user.preferredLang as SupportedLanguage)) {
    language = req.user.preferredLang as SupportedLanguage;
  }
  // 2. Check Accept-Language header
  else {
    const acceptLang = req.headers['accept-language'];
    if (typeof acceptLang === 'string') {
      const lang = acceptLang.split(',')[0].split('-')[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
        language = lang as SupportedLanguage;
      }
    }
  }

  // 3. Check query parameter (override)
  const queryLang = req.query.lang;
  if (typeof queryLang === 'string' && SUPPORTED_LANGUAGES.includes(queryLang as SupportedLanguage)) {
    language = queryLang as SupportedLanguage;
  }

  // Attach to request and response locals
  req.language = language;
  res.locals.language = language;

  // Set RTL flag for Arabic
  res.locals.isRTL = language === 'ar';

  next();
}

/**
 * Extend Express Request to include language
 */
declare global {
  namespace Express {
    interface Request {
      language?: SupportedLanguage;
    }
  }
}

export default { i18nMiddleware, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
