export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ minHeight: '100dvh' }}>
      {children}
    </div>
  )
}
