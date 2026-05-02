"use client"
import Link from "next/link"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { OFFICE_FULL_NAME, OFFICE_NAME, SURVEY_YEAR } from "@/lib/constants"

const LOGO_URL =
  "https://pkp.go.id/s3/website-perumahan/prod-storage/p2p-jawa-iii/logo_atas/01hr6kpg7t3q91g3b60f0e8qd2/01jsx5vvahcqwyxcgvz4bscjat.webp"

export default function HomePage() {
  const surveyUrl =
    (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000") + "/survey"

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#f5f7f8" }}>
      {/* Header */}
      <header style={{ background: "#113F51" }} className="shadow-md">
        <nav className="px-5 py-3 flex items-center gap-4 max-w-5xl mx-auto">
          <Image
            src={LOGO_URL}
            alt="Logo BP3KP Jawa III"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            unoptimized
          />
          <div className="ml-2 border-l border-white/20 pl-4">
            <p className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              {OFFICE_NAME}
            </p>
            <p className="text-white/60 text-xs">Kementerian Perumahan dan Kawasan Permukiman</p>
          </div>
        </nav>
      </header>

      {/* Gold accent bar */}
      <div style={{ background: "#D5C58A", height: "4px" }} />

      {/* Hero banner */}
      <div style={{ background: "#113F51" }} className="py-12 px-6 text-center no-print">
        <p className="text-white/70 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          {OFFICE_FULL_NAME}
        </p>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
          Layanan Umum
        </h1>
        <div className="w-16 h-1 mx-auto mt-4 rounded" style={{ background: "#D5C58A" }} />
      </div>

      {/* Content */}
      <div className="flex-1 py-10 px-4">
        <div className="max-w-md mx-auto space-y-5">

          {/* Registrasi Card — primary */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden no-print" style={{ borderBottom: "4px solid #D5C58A" }}>
            <div className="p-8 text-center">
              <div className="mb-4" style={{ fontSize: "3rem", color: "#113F51" }}>
                <ion-icon name="person-add-outline"></ion-icon>
              </div>
              <h2 className="text-lg font-bold mb-2" style={{ color: "#113F51", fontFamily: "Poppins, sans-serif" }}>
                Registrasi Pengguna Layanan
              </h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Mohon klik tombol di bawah untuk melanjutkan registrasi layanan.
              </p>
              <Link
                href="/tamu"
                className="inline-block w-full py-3 px-6 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90"
                style={{ background: "#113F51", fontFamily: "Poppins, sans-serif" }}
              >
                Mulai Pendaftaran →
              </Link>
            </div>
          </div>

          {/* SKM Survey Card — secondary */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden no-print" style={{ borderBottom: "4px solid #D5C58A" }}>
            <div className="p-8 text-center">
              <div className="mb-4" style={{ fontSize: "3rem", color: "#113F51" }}>
                <ion-icon name="clipboard-outline"></ion-icon>
              </div>
              <h2 className="text-lg font-bold mb-2" style={{ color: "#113F51", fontFamily: "Poppins, sans-serif" }}>
                Survei Kepuasan
              </h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Isi setelah selesai dilayani. Scan QR code atau klik tombol di bawah ini.
              </p>
              <Link
                href="/survey"
                className="inline-block w-full py-3 px-6 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
                style={{ background: "#f0f8fa", color: "#0E5B73", fontFamily: "Poppins, sans-serif", border: "2px solid #0E5B73" }}
              >
                Isi Survei →
              </Link>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "4px solid #D5C58A" }}>
            <div className="p-6 text-center">
              <h3 className="font-semibold mb-1 text-sm uppercase tracking-wide" style={{ color: "#113F51" }}>
                QR Code Survei
              </h3>
              <p className="text-xs text-gray-400 mb-5 no-print">
                Pindai untuk mengakses survei kepuasan dari perangkat Anda
              </p>
              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value={surveyUrl}
                  size={200}
                  fgColor="#113F51"
                  level="M"
                  includeMargin
                />
              </div>
              <p className="text-xs text-gray-400 break-all">{surveyUrl}</p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 no-print">
            Data yang Anda berikan hanya digunakan untuk kepentingan survei dan dilindungi kerahasiaannya.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-white/70 no-print" style={{ background: "#113F51" }}>
        © {SURVEY_YEAR} {OFFICE_NAME} — Kementerian Perumahan dan Kawasan Permukiman
      </footer>
    </main>
  )
}
