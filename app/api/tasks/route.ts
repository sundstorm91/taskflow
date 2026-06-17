import { createTask, Task } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST (request: NextRequest) {

    try {

    const body: Omit<Task, 'id' | 'createdAt'> = await request.json()
    const {title, status, userId, deadline, description} = body

    if (!title || !userId) {
        return NextResponse.json(
            { error: 'поля title и userId - обязательны'},
            { status: 400 }
        )
    }

    const newTask = createTask({
        title, status, userId, deadline, description
    })

    return NextResponse.json(
        {task: newTask, message: 'Добавление задачи: Успешно'},
        {status: 201}
    )

    } catch (error) {
        console.error('add Task error', error)
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        )
    }
}