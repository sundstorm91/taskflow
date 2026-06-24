import { getUserId } from '@/lib/auth'
import { createTask, getTasksByUserId } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, status, deadline, description } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Поле title обязательно' },
        { status: 400 }
      )
    }

    const newTask = await createTask({
      title,
      status: status || 'pending',
      deadline,
      description,
      userId,
    })

    return NextResponse.json(
      { task: newTask, message: 'Задача создана' },
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

export async function GET(request: NextRequest) {
  const userId = await getUserId(request)

  if (!userId) {
    return NextResponse.json(
      { error: 'Пользователь не авторизован' },
      { status: 401 }
    )
  }

  try {
    const tasks = await getTasksByUserId(userId)
    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error('GET tasks error:', error)
    return NextResponse.json(
      { error: 'Ошибка получения задач' },
      { status: 500 }
    )
  }
}