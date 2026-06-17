import { getUserId } from '@/lib/auth'
import { createTask, Task } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 1. Проверяем авторизацию
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Читаем данные задачи
    const body: Omit<Task, 'id' | 'createdAt'> = await request.json()
    const { title, status, deadline, description } = body

    // 3. Валидируем поля
    if (!title) {
      return NextResponse.json(
        { error: 'Поле title обязательно' },
        { status: 400 }
      )
    }

    // 4. Создаём задачу
    const newTask = createTask({
      title,
      status,
      userId,
      deadline,
      description,
    })

    // 5. Возвращаем ответ
    return NextResponse.json(
      { task: newTask, message: 'Добавление задачи: Успешно' },
      { status: 201 }
    )
  } catch (error) {
    console.error('add Task error', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}