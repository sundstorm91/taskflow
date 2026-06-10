// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Здесь потом добавим Sidebar и Header */}
      <main>{children}</main>
    </div>
  )
}
