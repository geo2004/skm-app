"use client"
import { Fragment, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SurveyQuestion, PROGRAM_SPECIFIC_QUESTIONS } from "@/lib/constants"

interface ResponseRow {
  id: number
  createdAt: string
  phone: string
  email: string
  age: number
  gender: string
  education: string
  unitLayanan: string
  q1: number; q2: number; q3: number; q4: number; q5: number
  q6: number; q7: number; q8: number; q9: number
  q10a: string | null
  q10b: string | null
  specificData: string | null
}

interface Props {
  data: ResponseRow[]
  total: number
  page: number
  totalPages: number
  search: string
  questions: SurveyQuestion[]
}

function scoreColor(v: number) {
  if (v <= 2) return "bg-red-100 text-red-700"
  return "bg-green-100 text-green-700"
}

export default function ResponsesTable({ data, total, page, totalPages, search, questions }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [searchInput, setSearchInput] = useState(search)

  function navigate(newPage: number, newSearch?: string) {
    const s = newSearch ?? search
    const params = new URLSearchParams()
    if (s) params.set("search", s)
    if (newPage > 1) params.set("page", String(newPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate(1, searchInput)
  }

  const qKeys = ["q1","q2","q3","q4","q5","q6","q7","q8","q9"] as const

  return (
    <div>
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nomor HP, email, unit layanan..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg font-medium text-white text-sm"
          style={{ background: "#0E5B73" }}
        >
          Cari
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearchInput(""); navigate(1, "") }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600"
          >
            Reset
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#113F51" }} className="text-white">
                <th className="px-4 py-3 text-left font-semibold">No</th>
                <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                <th className="px-4 py-3 text-left font-semibold">Unit Layanan</th>
                <th className="px-4 py-3 text-center font-semibold">Gender</th>
                <th className="px-4 py-3 text-center font-semibold">Usia</th>
                {questions.map((q) => (
                  <th key={q.id} className="px-2 py-3 text-center font-semibold">{q.key}</th>
                ))}
                <th className="px-4 py-3 text-center font-semibold">Rata</th>
                <th className="px-4 py-3 text-center font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={15} className="text-center py-12 text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              )}
              {data.map((r, idx) => {
                const avg = qKeys.reduce((a, k) => a + r[k], 0) / 9 * 25
                return (
                  <Fragment key={r.id}>
                    <tr
                      key={r.id}
                      className={`border-t border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-4 py-2.5 text-gray-500">{(page - 1) * 20 + idx + 1}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-2.5 max-w-[160px] truncate" title={r.unitLayanan}>
                        {r.unitLayanan}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {r.gender === "Laki-laki" ? "L" : "P"}
                      </td>
                      <td className="px-4 py-2.5 text-center">{r.age}</td>
                      {qKeys.map((k) => (
                        <td key={k} className="px-2 py-2.5 text-center">
                          <span className={`inline-block w-6 h-6 rounded text-xs font-bold leading-6 ${scoreColor(r[k])}`}>
                            {r[k]}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-2.5 text-center font-semibold">
                        {avg.toFixed(1)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          {expanded === r.id ? "Tutup" : "Lihat"}
                        </button>
                      </td>
                    </tr>
                    {expanded === r.id && (
                      <tr key={`exp-${r.id}`} className="bg-blue-50 border-t border-blue-100">
                        <td colSpan={15} className="px-6 py-4">
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Data Responden</p>
                              <p className="text-gray-600">HP: {r.phone}</p>
                              <p className="text-gray-600">Email: {r.email}</p>
                              <p className="text-gray-600">Pendidikan: {r.education}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 mb-1">Catatan</p>
                              <p className="text-gray-600">
                                <span className="font-medium">Kurang berkenan:</span>{" "}
                                {r.q10a || <span className="italic text-gray-400">—</span>}
                              </p>
                              <p className="text-gray-600 mt-1">
                                <span className="font-medium">Paling berkesan:</span>{" "}
                                {r.q10b || <span className="italic text-gray-400">—</span>}
                              </p>
                            </div>
                            {r.specificData && (() => {
                              const programQs = PROGRAM_SPECIFIC_QUESTIONS[r.unitLayanan] ?? []
                              const parsed = (() => {
                                try { return JSON.parse(r.specificData!) as Record<string, number> }
                                catch { return null }
                              })()
                              if (!parsed || programQs.length === 0) return null
                              return (
                                <div className="sm:col-span-2">
                                  <p className="font-semibold text-gray-700 mb-2" style={{ color: "#113F51" }}>
                                    Evaluasi Bantuan — {r.unitLayanan}
                                  </p>
                                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                                    {programQs.map((q) => (
                                      <p key={q.id} className="text-gray-600">
                                        <span className="font-medium">{q.label}:</span>{" "}
                                        {parsed[q.id]
                                          ? q.options.find((o) => o.value === parsed[q.id])?.label ?? parsed[q.id]
                                          : <span className="italic text-gray-400">—</span>}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Halaman {page} dari {totalPages} ({total} data)
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => navigate(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => navigate(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
