// lib/db.ts
import prisma from './prisma'
import { User, Task } from './generated/prisma/client'
import bcrypt from 'bcrypt'

// === ПОЛЬЗОВАТЕЛИ ===

// Получить всех пользователей
export async function getUsers() {
  return await prisma.user.findMany()
}

// Найти пользователя по email
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

// Найти пользователя по ID
export async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  })
}

// Создать нового пользователя
export async function createUser(data: {
  email: string
  password: string
  name?: string
}) {
  /* const hashedPassword = await bcrypt.hash(data.password, 10) */

  const hashedPassword = data.password // временно, без хеша

  return await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'user',
    },
  })
}

// === ЗАДАЧИ ===

// Получить все задачи пользователя
export async function getTasksByUserId(userId: number) {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

// Получить одну задачу по ID (с проверкой, что она принадлежит пользователю)
export async function getTaskById(id: number, userId: number) {
  return await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  })
}

// Создать задачу
export async function createTask(data: {
  title: string
  description?: string
  status?: string
  deadline?: string
  userId: number
}) {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || 'pending',
      deadline: data.deadline,
      userId: data.userId,
    },
  })
}

// Обновить задачу
export async function updateTask(
  id: number,
  userId: number,
  data: {
    title?: string
    description?: string
    status?: string
    deadline?: string
  }
) {
  // Сначала проверяем, что задача принадлежит пользователю
  const existingTask = await getTaskById(id, userId)
  if (!existingTask) {
    throw new Error('Задача не найдена или не принадлежит пользователю')
  }

  return await prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      deadline: data.deadline,
    },
  })
}

// Удалить задачу
export async function deleteTask(id: number, userId: number) {
  // Проверяем, что задача принадлежит пользователю
  const existingTask = await getTaskById(id, userId)
  if (!existingTask) {
    throw new Error('Задача не найдена или не принадлежит пользователю')
  }

  return await prisma.task.delete({
    where: { id },
  })
}

// === ВСПОМОГАТЕЛЬНЫЕ ===

// Получить все задачи (для администратора, если нужно)
export async function getAllTasks() {
  return await prisma.task.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  })
}