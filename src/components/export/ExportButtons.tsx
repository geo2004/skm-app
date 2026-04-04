"use client"
import { useState } from "react"

export default function ExportButtons({ year }: { year: string }) {
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)

  async function download(url: string, setLoading: (v: boolean) => void) {
    setLoading(true)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Gagal mengunduh")
      const blob = await res.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      const disp = res.headers.get("Content-Disposition") ?? ""
      const match = disp.match(/filename="([^"]+)"/)
      a.download = match?.[1] ?? `laporan-skm-${year}`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      alert("Gagal mengunduh file. Silakan coba lagi.")
    }
    setLoading(false)
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Excel */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="font-bold text-gray-800 mb-1">Ekspor Excel</h3>
        <p className="text-sm text-gray-500 mb-4">
          Data mentah responden dan rekap IKM dalam format .xlsx
        </p>
        <button
          onClick={() => download("/api/export/excel", setLoadingExcel)}
          disabled={loadingExcel}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#16a34a" }}
        >
          {loadingExcel ? "Mengunduh..." : "⬇ Unduh Excel (.xlsx)"}
        </button>
      </div>

      {/* PDF */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-4xl mb-3">📄</div>
        <h3 className="font-bold text-gray-800 mb-1">Ekspor PDF</h3>
        <p className="text-sm text-gray-500 mb-4">
          Laporan resmi SKM lengkap (BAB I–V) dalam format .pdf
        </p>
        <button
          onClick={() => download("/api/export/pdf", setLoadingPdf)}
          disabled={loadingPdf}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#dc2626" }}
        >
          {loadingPdf ? "Mengunduh..." : "⬇ Unduh PDF"}
        </button>
      </div>

      {/* Info */}
      <div className="sm:col-span-2 bg-blue-50 rounded-xl p-4 text-xs text-blue-700">
        <p className="font-semibold mb-1">Catatan:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>File Excel memuat dua sheet: Data Responden dan Rekapitulasi IKM</li>
          <li>File PDF memuat laporan formal 5 bab sesuai format Permenpan-RB No. 14/2017</li>
          <li>Expor mencakup semua data yang tersimpan hingga saat ini</li>
        </ul>
      </div>
    </div>
  )
}
