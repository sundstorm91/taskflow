import { getUserId } from '@/lib/auth'
import { getTaskById, updateTask, deleteTask } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// === PUT — обновление задачи ===
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const taskId = Number(id)

    const body = await request.json()
    const { title, description, status, deadline } = body

    // Проверяем, существует ли задача
    const existingTask = await getTaskById(taskId, userId)
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Задача не найдена или не принадлежит пользователю' },
        { status: 404 }
      )
    }

    // Обновляем задачу
    const updatedTask = await updateTask(taskId, userId, {
      title: title ?? existingTask.title,
      description: description !== undefined ? description : existingTask.description,
      status: status ?? existingTask.status,
      deadline: deadline !== undefined ? deadline : existingTask.deadline,
    })

    return NextResponse.json(
      { task: updatedTask, message: 'Задача обновлена' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// === DELETE — удаление задачи ===
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const taskId = Number(id)

    // Проверяем, существует ли задача
    const existingTask = await getTaskById(taskId, userId)
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Задача не найдена или не принадлежит пользователю' },
        { status: 404 }
      )
    }

    // Удаляем задачу
    await deleteTask(taskId, userId)

    return NextResponse.json(
      { message: 'Задача удалена' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}