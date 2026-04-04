import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AdminNav from "@/components/layout/AdminNav"
import SessionProvider from "@/components/layout/SessionProvider"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex" style={{ background: "#f5f6fa" }}>
        <AdminNav />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </SessionProvider>
  )
}
