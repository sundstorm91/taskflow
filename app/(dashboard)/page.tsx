'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/login')
      } else {
        setError('Ошибка при выходе')
      }
    } catch {
      setError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Дашборд</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button variant="secondary" onClick={handleLogout} className="text-sm" disabled={loading}>
          {loading ? 'Выходим...' : 'Выйти'}
        </Button>
      </div>
      <p className="text-gray-600 mt-2">Список задач появится здесь</p>
    </div>
  )
}
