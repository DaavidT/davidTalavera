import type { MiddlewareNext } from 'astro';

export const onRequest = async (context: any, next: MiddlewareNext) => {
  const response = await next();
  
  // Set correct MIME type for fonts
  if (context.url.pathname.endsWith('.woff2')) {
    response.headers.set('Content-Type', 'font/woff2');
  } else if (context.url.pathname.endsWith('.woff')) {
    response.headers.set('Content-Type', 'font/woff');
  } else if (context.url.pathname.endsWith('.ttf')) {
    response.headers.set('Content-Type', 'font/ttf');
  }
  
  // Static assets (images, fonts, scripts, styles): 1 year cache
  if (/\.(webp|png|jpg|jpeg|gif|woff2?|ttf|css|js)$/.test(context.url.pathname)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // HTML: 1 hour cache (allows updates without cache busting)
  else if (context.url.pathname.endsWith('.html') || !context.url.pathname.includes('.')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  
  return response;
};
