"use client"
import { useState, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { OFFICE_NAME } from "@/lib/constants"

const LOGO_URL = "/logo_pkp.png"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(""); setLoading(true)
    const result = await signIn("credentials", { username, password, redirect: false })
    if (result?.ok) {
      router.push("/admin/dashboard")
    } else {
      setError("Username atau password salah.")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#f5f7f8" }}>
      {/* Header */}
      <header style={{ background: "#113F51" }}>
        <div className="px-5 py-3 flex items-center gap-3 max-w-lg mx-auto">
          <Image src={LOGO_URL} alt="Logo" width={120} height={36} className="h-9 w-auto object-contain" unoptimized />
        </div>
        <div style={{ background: "#D5C58A", height: "3px" }} />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            style={{ borderBottom: "4px solid #D5C58A" }}
          >
            <div className="px-6 py-4 text-center" style={{ background: "#113F51" }}>
              <h1 className="text-white font-bold text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                Masuk Admin SKM
              </h1>
              <p className="text-white/50 text-xs mt-0.5">{OFFICE_NAME}</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div
                    className="border-l-4 rounded p-3 text-sm"
                    style={{ background: "#fff3cd", borderColor: "#CDB278", color: "#856404" }}
                  >
                    ⚠ {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0E5B73]"
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0E5B73]"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#0E5B73", fontFamily: "Poppins, sans-serif" }}>
                  {loading ? "Masuk..." : "Masuk"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
