import Link from "next/link"
import Image from "next/image"
import { OFFICE_NAME, SURVEY_YEAR } from "@/lib/constants"

const LOGO_URL = "/logo_pkp.png"

export default function TerimaKasihPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#f5f7f8" }}>
      <header style={{ background: "#113F51" }}>
        <nav className="px-4 py-2.5 flex items-center gap-3 max-w-xl mx-auto">
          <Image src={LOGO_URL} alt="Logo" width={120} height={36} className="h-8 w-auto object-contain" unoptimized />
        </nav>
        <div style={{ background: "#D5C58A", height: "3px" }} />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden text-center"
          style={{ borderBottom: "4px solid #D5C58A" }}
        >
          <div className="px-6 py-4" style={{ background: "#113F51" }}>
            <h1 className="text-white font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
              Survei Selesai
            </h1>
          </div>
          <div className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#113F51", fontFamily: "Poppins, sans-serif" }}>
              Terima Kasih!
            </h2>
            <p className="text-gray-600 mb-2 text-sm">Jawaban Anda telah berhasil disimpan.</p>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Masukan Anda sangat berarti bagi {OFFICE_NAME} untuk terus meningkatkan
              kualitas pelayanan kepada masyarakat.
            </p>

            <div
              className="rounded-lg p-3 mb-8 text-sm"
              style={{ background: "#f0f8fa", borderLeft: "3px solid #D5C58A" }}
            >
              <p className="font-semibold" style={{ color: "#113F51" }}>SKM {OFFICE_NAME}</p>
              <p className="text-xs text-gray-400">Tahun {SURVEY_YEAR}</p>
            </div>

            <Link href="/"
              className="inline-block w-full py-3 px-6 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#0E5B73", fontFamily: "Poppins, sans-serif" }}>
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
