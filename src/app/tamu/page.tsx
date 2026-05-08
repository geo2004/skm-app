"use client"
import { useState, FormEvent } from "react"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import {
  UNIT_LAYANAN_OPTIONS,
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  OFFICE_NAME,
  SURVEY_YEAR,
} from "@/lib/constants"

const SURVEY_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000") + "/survey"

const LOGO_URL = "/logo_pkp.png"

type FormData = {
  nama: string
  phone: string
  email: string
  keperluan: string
  age: string
  gender: string
  education: string
  unitLayanan: string
}

const EMPTY: FormData = {
  nama: "", phone: "", email: "", keperluan: "",
  age: "", gender: "", education: "", unitLayanan: "",
}

const STEPS = ["Identitas", "Layanan"]

export default function BukuTamuPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [registeredName, setRegisteredName] = useState("")

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function validateStep(): string {
    if (step === 0) {
      if (!form.nama || form.nama.trim().length < 2) return "Nama lengkap tidak valid."
      if (!form.phone || form.phone.trim().length < 8) return "Nomor HP tidak valid."
      if (form.email && !form.email.includes("@")) return "Format email tidak valid."
    }
    if (step === 1) {
      const age = Number(form.age)
      if (!Number.isInteger(age) || age < 15 || age > 100) return "Usia harus antara 15–100 tahun."
      if (!form.gender) return "Pilih jenis kelamin."
      if (!form.education) return "Pilih pendidikan terakhir."
      if (!form.unitLayanan) return "Pilih unit layanan yang dituju."
    }
    return ""
  }

  function next() {
    const err = validateStep()
    if (err) { setError(err); return }
    setError(""); setStep((s) => s + 1); window.scrollTo(0, 0)
  }
  function prev() { setError(""); setStep((s) => s - 1); window.scrollTo(0, 0) }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const err = validateStep()
    if (err) { setError(err); return }
    setError(""); setSubmitting(true)
    try {
      const res = await fetch("/api/tamu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Terjadi kesalahan.")
        setSubmitting(false)
        return
      }
      const data = await res.json()
      setRegisteredName(data.nama)
      setDone(true)
      window.scrollTo(0, 0)
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.")
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#f5f7f8" }}>
      {/* Header */}
      <header style={{ background: "#113F51" }} className="shadow-md">
        <nav className="px-4 py-2.5 flex items-center gap-3 max-w-xl mx-auto">
          <Image src={LOGO_URL} alt="Logo" width={120} height={36} className="h-8 w-auto object-contain" unoptimized />
          <div className="border-l border-white/20 pl-3">
            <p className="text-white text-xs font-semibold leading-tight">{OFFICE_NAME}</p>
            <p className="text-white/50 text-xs">Buku Tamu {SURVEY_YEAR}</p>
          </div>
          <a
            href="https://griya-app.vercel.app"
            className="ml-auto text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
          >
            ← GRIYA App
          </a>
        </nav>
        <div style={{ background: "#D5C58A", height: "3px" }} />
      </header>

      {!done && (
        <div style={{ background: "#0E5B73" }} className="px-4 py-3">
          <div className="max-w-xl mx-auto flex items-center gap-1">
            {STEPS.map((label, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-0.5 transition-all ${
                    i < step ? "bg-[#D5C58A] text-[#113F51]"
                    : i === step ? "bg-white text-[#0E5B73]"
                    : "bg-white/20 text-white/50"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === step ? "text-white font-semibold" : "text-white/40"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Success screen */}
        {done && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
            <div className="px-6 py-4" style={{ background: "#113F51" }}>
              <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Pendaftaran Berhasil
              </h2>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
                style={{ background: "#d1fae5" }}>
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Selamat datang, {registeredName}!
                </p>
                <p className="text-sm text-gray-500 mt-1">Data Anda telah tercatat.</p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-2 py-2">
                <QRCodeSVG value={SURVEY_URL} size={160} />
                <p className="text-xs text-gray-400 break-all">{SURVEY_URL}</p>
                <a
                  href={SURVEY_URL}
                  className="mt-2 inline-block w-full py-3 rounded-lg font-semibold text-white text-sm text-center hover:opacity-90 transition-opacity"
                  style={{ background: "#0E5B73", fontFamily: "Poppins, sans-serif" }}
                >
                  Survei Kepuasan Layanan →
                </a>
              </div>

              <div className="rounded-lg p-4 text-sm text-left" style={{ background: "#f0f8fa", borderLeft: "3px solid #D5C58A" }}>
                <p className="font-semibold mb-2" style={{ color: "#113F51" }}>Langkah selanjutnya:</p>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Silakan duduk di ruang tunggu layanan, petugas layanan yang ditunjuk akan menemui anda.</li>
                  <li>Setelah selesai, mohon scan QR code di atas.</li>
                  <li>Mohon dapat mengisi Survei Kepuasan Layanan sesuai alamat web pada QR Code, masukan anda akan sangat berarti bagi perbaikan layanan kami kedepan, terimakasih.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!done && (
          <>
            {error && (
              <div className="border-l-4 rounded-lg p-4 mb-4 text-sm"
                style={{ background: "#fff3cd", borderColor: "#CDB278", color: "#856404" }}>
                ⚠ {error}
              </div>
            )}

            {/* Step 0: Identitas */}
            {step === 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
                <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
                  <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Langkah 1 — Data Diri
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                    <input type="text" placeholder="Nama sesuai KTP"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      value={form.nama} onChange={(e) => set("nama", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP *</label>
                    <input type="tel" placeholder="08xxxxxxxxxx"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                    <p className="text-xs text-gray-400 mt-1">Nomor ini akan digunakan untuk mengisi survei setelah dilayani.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400">(opsional)</span></label>
                    <input type="email" placeholder="email@domain.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan <span className="text-gray-400">(opsional)</span></label>
                    <input type="text" placeholder="Contoh: konsultasi, pengajuan berkas, ..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                      value={form.keperluan} onChange={(e) => set("keperluan", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Layanan */}
            {step === 1 && (
              <form onSubmit={submit}>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
                  <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
                    <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                      Langkah 2 — Profil &amp; Layanan
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usia *</label>
                        <input type="number" min={15} max={100} placeholder="Tahun"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                          value={form.age} onChange={(e) => set("age", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin *</label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                          value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                          <option value="">Pilih</option>
                          {GENDER_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir *</label>
                      <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                        value={form.education} onChange={(e) => set("education", e.target.value)}>
                        <option value="">Pilih pendidikan</option>
                        {EDUCATION_OPTIONS.map((e) => <option key={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Layanan yang Dituju *</label>
                      <div className="space-y-2 mt-2">
                        {UNIT_LAYANAN_OPTIONS.map((opt) => (
                          <button key={opt} type="button" onClick={() => set("unitLayanan", opt)}
                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                              form.unitLayanan === opt
                                ? "text-white border-transparent"
                                : "border-gray-200 bg-white text-gray-700 hover:border-[#0E5B73]"
                            }`}
                            style={form.unitLayanan === opt ? { background: "#0E5B73" } : {}}>
                            {form.unitLayanan === opt ? "✓ " : ""}{opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" disabled={submitting}
                      className="w-full py-3 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: "#0E5B73", fontFamily: "Poppins, sans-serif" }}>
                      {submitting ? "Mendaftar..." : "Daftar Sekarang →"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="flex justify-between mt-4">
              {step > 0 ? (
                <button type="button" onClick={prev}
                  className="px-5 py-2.5 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50"
                  style={{ borderColor: "#CDB278" }}>
                  ← Kembali
                </button>
              ) : <div />}
              {step === 0 && (
                <button type="button" onClick={next}
                  className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm hover:opacity-90"
                  style={{ background: "#0E5B73" }}>
                  Lanjut →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
