import { getUserId } from '@/lib/auth'
import { createTask, getTasks, readDB, Task, writeDB } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest, {params} : {params: {id : string }}) {
    const { id } = await params
    const userId = await getUserId(request)

    if (!userId) {
    return NextResponse.json(
      { error: 'Пользователь не авторизован' },
      { status: 401}
    )
  }

  try {

    const body = await request.json()
    const { title, description, status, deadline } = body
    const tasks = getTasks()

    const taskIndex = tasks.findIndex(item => item.id === +(id) && item.userId === userId)

    if (taskIndex === -1 ) {
        return NextResponse.json(
        { error: 'Задача не найдена' },
        { status: 404 }
      )
    }

  const updatedTask = {
      ...tasks[taskIndex],
      title: title ?? tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      status: status ?? tasks[taskIndex].status,
      deadline: deadline !== undefined ? deadline : tasks[taskIndex].deadline,
      updatedAt: new Date().toISOString(),
    }

    const db = readDB()
    db.tasks[taskIndex] = updatedTask
    writeDB(db)

  return NextResponse.json(
      { task: updatedTask, message: 'Задача успешно передана сервером' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ошибка передачи задачи сервером', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )

    }

}