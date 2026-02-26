import type { APIRoute } from 'astro';
import {
  CONTACT_FORM_TO_EMAIL,
  CONTACT_GLOBAL_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_GLOBAL_RATE_LIMIT_WINDOW_MS,
  CONTACT_MAX_CONTENT_LENGTH,
  CONTACT_MIN_FORM_FILL_MS,
  CONTACT_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW_MS,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
} from 'astro:env/server';

export const prerender = false;

import { contactFormSchema as ContactFormSchema } from '@/features/contact/type';
import { ui, type LanguageCode } from '@/i18n/ui';
import { sendContactEmail } from '@/lib/contact/resend';
import { createFixedWindowRateLimiter } from '@/lib/contact/rate-limit';
import type {
  ContactFormTranslations,
  ContactFormApiResponse,
} from '@/features/contact/type';

const perIpLimiter = createFixedWindowRateLimiter();
const globalLimiter = createFixedWindowRateLimiter();

export const POST: APIRoute = async ({ request, url }) => {
  let lang: LanguageCode = 'en';
  let currentTranslations: ContactFormTranslations = ui[lang]
    .contactPage as ContactFormTranslations;

  if (!isSameOriginRequest(request, url)) {
    return jsonResponse(
      {
        status: 'error',
        message: currentTranslations.toastErrorFailedToSend,
      },
      403
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > CONTACT_MAX_CONTENT_LENGTH) {
    return jsonResponse(
      {
        status: 'error',
        message: currentTranslations.toastErrorFailedToSend,
      },
      413
    );
  }

  let requestBody: Record<string, unknown>;
  try {
    const parsedBody = await request.json();
    if (!isRecord(parsedBody)) {
      throw new Error('Invalid JSON payload');
    }

    requestBody = parsedBody;

    const requestLang = requestBody.lang as LanguageCode | undefined;
    if (requestLang && isLanguageCode(requestLang)) {
      lang = requestLang;
      currentTranslations = ui[lang].contactPage as ContactFormTranslations;
    }
  } catch {
    const errorResponse: ContactFormApiResponse = {
      status: 'error',
      message: currentTranslations.toastErrorUnexpected,
      error: 'Invalid JSON input',
    };
    return jsonResponse(errorResponse, 400);
  }

  const honeypot = getSafeString(requestBody.website);
  if (honeypot.length > 0) {
    return jsonResponse(
      {
        status: 'success',
        message: currentTranslations.toastSuccessMessageSent,
      },
      200
    );
  }

  const startedAt = Number(requestBody.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const fillDuration = Date.now() - startedAt;
    if (fillDuration < CONTACT_MIN_FORM_FILL_MS) {
      return rateLimitResponse(currentTranslations, 60);
    }
  }

  const clientIp = getClientIp(request);
  const ipLimit = perIpLimiter.consume({
    key: `ip:${clientIp}`,
    maxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
    windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
  });

  if (!ipLimit.allowed) {
    return rateLimitResponse(currentTranslations, ipLimit.retryAfterSeconds);
  }

  const globalLimit = globalLimiter.consume({
    key: 'contact:global',
    maxRequests: CONTACT_GLOBAL_RATE_LIMIT_MAX_REQUESTS,
    windowMs: CONTACT_GLOBAL_RATE_LIMIT_WINDOW_MS,
  });

  if (!globalLimit.allowed) {
    return rateLimitResponse(currentTranslations, globalLimit.retryAfterSeconds);
  }

  const {
    lang: _lang,
    website: _website,
    startedAt: _startedAt,
    ...formDataForValidation
  } = requestBody;

  const validationResult = ContactFormSchema.safeParse(formDataForValidation);

  if (!validationResult.success) {
    return jsonResponse(
      {
        status: 'error',
        message: currentTranslations.toastErrorValidationFailed,
        errors: validationResult.error.flatten().fieldErrors,
      } as ContactFormApiResponse,
      400
    );
  }

  const { firstName, lastName, email, message } = validationResult.data;

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !CONTACT_FORM_TO_EMAIL) {
    console.error('[contact] Missing required Resend environment variables.');
    return jsonResponse(
      {
        status: 'error',
        message: currentTranslations.toastErrorFailedToSend,
      },
      500
    );
  }

  try {
    const resendResult = await withTimeout(
      sendContactEmail({
        apiKey: RESEND_API_KEY,
        fromEmail: RESEND_FROM_EMAIL,
        toEmail: CONTACT_FORM_TO_EMAIL,
        submission: {
          firstName,
          lastName,
          email,
          message,
          lang,
        },
        metadata: {
          ip: clientIp,
          userAgent: getSafeString(request.headers.get('user-agent')) || 'unknown',
        },
      }),
      10_000
    );

    if (resendResult.error) {
      console.error('[contact] Resend API returned an error:', resendResult.error);
      return jsonResponse(
        {
          status: 'error',
          message: currentTranslations.toastErrorFailedToSend,
        },
        502
      );
    }

    return jsonResponse(
      {
        status: 'success',
        message: currentTranslations.toastSuccessMessageSent,
        data: { id: resendResult.data?.id },
      },
      200
    );
  } catch (error) {
    console.error('[contact] Unexpected send error:', error);
    return jsonResponse(
      {
        status: 'error',
        message: currentTranslations.toastErrorUnexpected,
      },
      500
    );
  }
};

function rateLimitResponse(
  translations: ContactFormTranslations,
  retryAfterSeconds: number
) {
  return jsonResponse(
    {
      status: 'error',
      message: translations.toastErrorTooManyRequests,
    },
    429,
    {
      'Retry-After': String(Math.max(1, retryAfterSeconds)),
    }
  );
}

function jsonResponse(
  payload: ContactFormApiResponse,
  status: number,
  extraHeaders?: Record<string, string>
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === 'string' && value in ui;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getSafeString(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function isSameOriginRequest(request: Request, requestUrl: URL) {
  const origin = request.headers.get('origin');
  if (origin) {
    return hasSameOrigin(origin, requestUrl);
  }

  const referer = request.headers.get('referer');
  if (referer) {
    return hasSameOrigin(referer, requestUrl);
  }

  return true;
}

function hasSameOrigin(headerValue: string, requestUrl: URL) {
  try {
    return new URL(headerValue).origin === requestUrl.origin;
  } catch {
    return false;
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const fallbackKey = request.headers.get('user-agent') ?? 'unknown';
  return `unknown:${fallbackKey.slice(0, 50)}`;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeoutMs);
  });

  try {
    return (await Promise.race([promise, timeoutPromise])) as T;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
