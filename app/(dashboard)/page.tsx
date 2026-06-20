'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUser } from '@/context/UserContext'
import { Task } from '@/lib/db'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

  // Состояния формы
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending')
  const [deadline, setDeadline] = useState('')
  const { user } = useUser()

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/login')
      } else {
        setError('Ошибка при выходе')
      }
    } catch {
      setError('Ошибка соединения')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true) // ← включаем лоадер

    if (!user) {
      setError('Пользователь не авторизован')
      setLoading(false) // ← сбрасываем
      return
    }

    const optimisticTask = {
      id: Date.now(),
      title,
      description,
      status,
      deadline,
      userId: user.id,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [optimisticTask, ...prev])
    setTitle('')
    setDescription('')
    setStatus('pending')
    setDeadline('')

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status,
          deadline,
          userId: user.id,
        }),
      })

      if (!res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== optimisticTask.id))
        setError('Ошибка создания задачи')
      }
    } catch {
      setTasks((prev) => prev.filter((task) => task.id !== optimisticTask.id))
      setError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks')
    const data = await res.json()
    setTasks(data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Хедер с кнопкой выхода */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Дашборд</h1>
        <Button variant="secondary" onClick={handleLogout} className="text-sm">
          Выйти
        </Button>
      </div>

      {/* Форма создания задачи */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Создать задачу</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание задачи (необязательно)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Ожидает</option>
                <option value="in-progress">В работе</option>
                <option value="completed">Выполнена</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Создание...' : 'Создать задачу'}
          </Button>
        </form>
      </div>

      {/* Список задач (заглушка) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Список задач</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {tasks.length === 0 ? (
            <p className="text-gray-500">Задач пока нет</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task: Task) => (
                <li key={task.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">{task.status}</span>
                  </div>
                  {task.deadline && (
                    <p className="text-xs text-gray-500 mt-1">
                      Дедлайн: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
