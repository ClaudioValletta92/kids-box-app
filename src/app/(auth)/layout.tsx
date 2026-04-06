export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Kids Box</h1>
        <p className="mt-1 text-sm text-gray-500">Educational boxes for every stage</p>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  )
}
