import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Включаем Strict Mode React для отлова потенциальных проблем на этапе разработки
  // Настоятельно рекомендуется Next.js [citation:7]
  reactStrictMode: true,

  // Настройки компилятора
  compiler: {
    // Удаляем console.log в production (полезно для дашборда, чтобы не засорять консоль)
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Проксируем переменные окружения на клиент
  // Доступны в браузере через process.env.NEXT_PUBLIC_*
  env: {
    NEXT_PUBLIC_APP_NAME: 'TaskFlow',
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
  },
}

module.exports = nextConfig

export default nextConfig;
