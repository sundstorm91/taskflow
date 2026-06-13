import { NextRequest, NextResponse } from 'next/server'
import { findUserByMail } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // 1. Проверка, что поля заполнены
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // 2. Поиск пользователя
    const user = findUserByMail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // 3. Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // 4. Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = user

    // 5. Возвращаем пользователя
    return NextResponse.json(
      { user: userWithoutPassword, message: 'Вход выполнен успешно' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}