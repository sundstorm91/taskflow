import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function TestPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Тест UI компонентов</h1>

        {/* Тест кнопок */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Кнопки (Button)</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
          </div>
        </section>

        {/* Тест инпутов */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Поля ввода (Input)</h2>
          <div className="space-y-4">
            <Input placeholder="Обычный инпут" />
            <Input placeholder="С типом email" type="email" />
            <Input placeholder="Disabled" disabled />
            <Input placeholder="С кастомным классом" className="border-blue-500" />
          </div>
        </section>

        {/* Тест формы */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Пример формы</h2>
          <div className="space-y-4">
            <Input placeholder="Email" type="email" />
            <Input placeholder="Пароль" type="password" />
            <Button variant="primary" className="w-full">
              Войти
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
