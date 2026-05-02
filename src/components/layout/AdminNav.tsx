"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { OFFICE_NAME } from "@/lib/constants"

const LOGO_URL = "/logo_pkp.png"

const NAV = [
  { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/admin/responses", icon: "📋", label: "Respon" },
  { href: "/admin/export", icon: "⬇️", label: "Ekspor" },
]

export default function AdminNav() {
  const path = usePathname()

  return (
    <>
      {/* Sidebar — desktop */}
      <aside
        className="hidden md:flex flex-col w-60 min-h-screen shrink-0 shadow-lg"
        style={{ background: "#113F51" }}
      >
        {/* Logo area */}
        <div className="p-5" style={{ borderBottom: "2px solid #D5C58A" }}>
          <Image
            src={LOGO_URL}
            alt="Logo BP3KP"
            width={140}
            height={42}
            className="h-10 w-auto object-contain mb-3"
            unoptimized
          />
          <p className="text-white/80 text-xs leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Panel Admin SKM
          </p>
          <p className="text-white/40 text-xs">{OFFICE_NAME}</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                path.startsWith(item.href)
                  ? "text-[#113F51] font-semibold"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
              style={path.startsWith(item.href) ? { background: "#D5C58A" } : {}}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Link href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-xs transition-colors">
            🌐 Lihat Survei
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-white/50 hover:text-red-300 hover:bg-white/10 text-xs mt-1 transition-colors">
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* Bottom nav — mobile */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 flex shadow-lg"
        style={{ background: "#113F51", borderTop: "2px solid #D5C58A" }}
      >
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              path.startsWith(item.href) ? "font-semibold" : "text-white/50"
            }`}
            style={path.startsWith(item.href) ? { color: "#D5C58A" } : {}}>
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
