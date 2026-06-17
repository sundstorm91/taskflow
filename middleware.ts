// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

 /* Alert!  функция для получения секрета должна быть асинхронной и возвращать Uint8Array */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  // Конвертируем строковый секрет в Uint8Array, как требует jose
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  let isValidToken = false;

  // Пытаемся верифицировать токен с помощью jose
  if (token) {
    try {
      const secret = getJwtSecret();
      await jwtVerify(token, secret);
      isValidToken = true;
    } catch (error) {
      /* console.log('Token verification failed:', error.message); */
      // Если токен невалиден, удаляем его из cookies
      const response = NextResponse.next();
      response.cookies.delete('token');
      // Важно: мы не возвращаем response здесь, а просто продолжаем.
      // isValidToken останется false.
    }
  }

  // --- ЛОГИКА ЗАЩИТЫ МАРШРУТОВ ---

  // 1. Если пользователь на страницах входа/регистрации И токен валиден -> на дашборд
  if ((pathname === '/login' || pathname === '/register') && isValidToken) {
    console.log(`Middleware: Redirecting from ${pathname} to / (valid token)`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Если пользователь пытается зайти на защищенный маршрут И токен НЕ валиден -> на логин
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/dashboard');
  if (isProtectedRoute && !isValidToken) {
    console.log(`Middleware: Redirecting from ${pathname} to /login (invalid token)`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Во всех остальных случаях разрешаем доступ
  return NextResponse.next();
}

// Конфигурация: middleware будет запускаться для всех маршрутов,
// кроме статических файлов и API (это стандартная практика)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};