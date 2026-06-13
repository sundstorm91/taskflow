import { NextRequest, NextResponse } from 'next/server'
import { findUserByMail, createUser } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // 1. Проверка, что все поля заполнены
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      )
    }

    // 2. Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      )
    }

    // 3. Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен быть минимум 6 символов' },
        { status: 400 }
      )
    }

    // 4. Проверка, существует ли пользователь
    const existingUser = findUserByMail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    // 5. Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    // 6. Создание пользователя
    const newUser = createUser({
      email,
      password: hashedPassword,
      name,
    })

    // 7. Удаляем пароль из ответа
    const { password: _, ...userWithoutPassword } = newUser

    // 8. Возвращаем успешный ответ
    return NextResponse.json(
      { user: userWithoutPassword, message: 'Регистрация успешна' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}