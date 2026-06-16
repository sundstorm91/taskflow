// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Вы вышли' })
  response.cookies.delete('token')
  return response
}