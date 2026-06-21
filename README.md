# TaskFlow — командная доска задач

TaskFlow — это fullstack-приложение для управления задачами с авторизацией, ролями (админ/пользователь), дедлайнами и фильтрацией. Построено на Next.js 15, Prisma, SQLite, Tailwind.

---

## День 1 — Инициализация

**Что сделано:**
Создан Next.js проект (TS, Tailwind, App Router), настроены ESLint, Prettier, Husky, переменные окружения, базовый layout.

**С чем столкнулись:**

- `create-next-app` не инициализировал git → сделали вручную `git init`.
- Ошибка с npm-зеркалом (`gitverse.ru`) — битый JSON → сменили registry на официальный.
- Tailwind v4 требует `@import "tailwindcss"` вместо старых директив.

**Ключевой код:**

```typescript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },
  env: { NEXT_PUBLIC_APP_NAME: 'TaskFlow' },
}
```

## День 2 — Маршруты и UI

**Что сделано:**
Созданы групповые папки `(auth)` и `(dashboard)`, страницы логина/регистрации, переиспользуемые компоненты `Button` и `Input`.

**С чем столкнулись:**

- `layout.tsx` внутри `register/` вызывал ошибку → оставили только `page.tsx`.
- `app/page.tsx` перекрывал `(dashboard)/page.tsx` → удалили корневой `page.tsx`.
- В `(auth)/layout.tsx` нельзя использовать `<html>` и `<body>` — они уже есть в корневом layout.

**Ключевой код:**

```tsx
// components/ui/Button.tsx
export function Button({ variant = 'primary', children, ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  }
  return (
    <button className={`px-4 py-2 rounded-lg ${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}
```

## День 3 — API и JSON

**Что сделано:**
Создана файловая БД (`db.json`), утилиты для чтения/записи, реализованы API-роуты для регистрации и логина с хешированием паролей (bcrypt).

**С чем столкнулись:**

- `JSON.stringify({ payload })` отправлял объект с ключом `payload` → исправили на `JSON.stringify(payload)`.
- Ошибка типов `Omit<User, ...>` и порядок полей при spread → явно перечисляем поля, чтобы избежать конфликтов.
- `findUserByMail` возвращал `undefined` → добавили проверку `if (!user) return 401`.
- При создании пользователя `role` и `createdAt` генерируются сервером, а не приходят от клиента → используем `Omit` в типе.
- Пароль нужно хранить в зашифрованном виде → добавили `bcrypt` для хеширования.

**Ключевой код:**

```typescript
// lib/db.ts — утилиты для работы с JSON
export function readDB(): DB {
  const data = fs.readFileSync(dbPath, 'utf-8')
  return JSON.parse(data)
}

export function writeDB(data: DB): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

export function createUser(userData: Omit<User, 'id' | 'role' | 'createdAt'>): User {
  const db = readDB()
  const newUser: User = {
    id: Date.now(),
    ...userData,
    role: 'user',
    createdAt: new Date().toISOString(),
  }
  db.users.push(newUser)
  writeDB(db)
  return newUser
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((user) => user.email === email)
}
```

## День 4 — Авторизация и защита

**Что сделано:**
Внедрена JWT-авторизация с `httpOnly` cookies, создан middleware для защиты дашборда, реализован logout, добавлен UserContext для хранения данных пользователя на клиенте.

**С чем столкнулись:**

- `jsonwebtoken` не работает в Edge Runtime (среде выполнения middleware) → заменили на `jose`.
- `JWT_SECRET` не загружался → перенесли `.env.local` в корень проекта и перезапустили сервер.
- Middleware не срабатывал → переместили `middleware.ts` в корень (рядом с `app/`).
- После удаления cookie доступ к дашборду сохранялся → проблема была в логике `!token` → исправили на проверку `isValidToken`.
- Контекст пользователя сбрасывался после F5 → синхронизировали с `localStorage`.

**Ключевой код:**

```typescript
// lib/auth.ts — работа с JWT и получение userId
import { jwtVerify } from 'jose'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return new TextEncoder().encode(secret)
}

export async function getUserId(request: NextRequest): Promise<number | null> {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload.userId as number
  } catch {
    return null
  }
}
```

## День 5 — Задачи

**Что сделано:**
Созданы API для CRUD задач (`GET` и `POST`), форма создания на дашборде с оптимистичными обновлениями, список задач с фильтрацией по пользователю, исправлена потеря контекста (localStorage), решены проблемы с загрузчиком и типизацией.

**С чем столкнулись:**

- `fs` в клиентском компоненте → убрали импорт `createTask`, оставили только `fetch`.
- `GET /api/tasks` не возвращал данные → добавили `GET`-обработчик с чтением `db.json`.
- Пустой ответ от сервера (`Unexpected end of JSON input`) → добавили `try/catch` и корректные `NextResponse.json()`.
- Список задач не обновлялся после создания → реализовали оптимистичное обновление (задача добавляется в UI сразу).
- `userId` мог быть `undefined` → добавили проверку `if (!user)` в `handleSubmit`.
- Контекст пользователя сбрасывался после F5 → синхронизировали `UserContext` с `localStorage`.
- Все задачи видели все пользователи → в `GET /api/tasks` добавили фильтрацию по `userId` через `getUserId(request)`.
- Синтаксис `NextResponse` без `.json()` → исправили на `NextResponse.json()`.
- `GET` не принимал `request` → добавили параметр `request: NextRequest`, чтобы читать cookies.

**Ключевой код:**

```typescript
// app/api/tasks/route.ts
import { getUserId } from '@/lib/auth'
import { getTasks, createTask } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allTasks = getTasks()
    const userTasks = allTasks.filter((task) => task.userId === userId)
    return NextResponse.json(userTasks, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка получения задач' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status, deadline } = body

    if (!title) {
      return NextResponse.json({ error: 'Поле title обязательно' }, { status: 400 })
    }

    const newTask = createTask({
      title,
      description,
      status: status || 'pending',
      deadline,
      userId,
    })

    return NextResponse.json({ task: newTask, message: 'Задача создана' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка создания задачи' }, { status: 500 })
  }
}
```
