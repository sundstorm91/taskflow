import { getJwtSecret } from '@/middleware';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server'

export async function getUserId(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Пытаемся верифицировать токен с помощью jose
    if (token) {
        try {
          const secret = getJwtSecret();
          const { payload } = await jwtVerify(token, secret);
            return payload.userId as number
        } catch (error) {
          console.log('Token verification failed:', error);
          return null
        }
      }




}