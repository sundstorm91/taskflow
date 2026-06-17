'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Состояния формы
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending')
  const [deadline, setDeadline] = useState('')

  // TODO: получить реальный userId из контекста/токена
  const userId = 1781323328954 // временно (заменить позже)

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
    setLoading(true)

    // TODO: добавить логику создания задачи
    console.log('Создаём задачу:', { title, description, status, deadline, userId })

    // Заглушка
    setTimeout(() => {
      setLoading(false)
      setTitle('')
      setDescription('')
      setStatus('pending')
      setDeadline('')
    }, 1000)
  }

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
          <p className="text-gray-500">Здесь появится список задач</p>
        </div>
      </div>
    </div>
  )
}
