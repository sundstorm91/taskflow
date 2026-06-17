'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// Тип пользователя (тот, что приходит с сервера)
type User = {
  id: number
  email: string
  name: string
  role: 'user' | 'admin'
}

// Тип контекста
type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

// Создаём контекст
const UserContext = createContext<UserContextType | undefined>(undefined)

// Провайдер (обёртка для всего приложения)
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

// Кастомный хук для использования контекста
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
