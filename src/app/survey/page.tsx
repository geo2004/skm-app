"use client"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import LikertOption from "@/components/survey/LikertOption"
import {
  SURVEY_QUESTIONS,
  UNIT_LAYANAN_OPTIONS,
  EDUCATION_OPTIONS,
  EDUCATION_LEGACY_MAP,
  GENDER_OPTIONS,
  AGE_GROUPS,
  PEKERJAAN_OPTIONS,
  DISABILITAS_OPTIONS,
  HOUSING_PROGRAM_KEYS,
  PROGRAM_SPECIFIC_QUESTIONS,
  OFFICE_NAME,
  SURVEY_YEAR,
} from "@/lib/constants"
import { getAgeGroup } from "@/lib/ikm"

const LOGO_URL = "/logo_pkp.png"

type FormData = {
  unitLayanan: string
  nama: string; keperluan: string
  phone: string; email: string; ageGroup: string; gender: string
  education: string; pekerjaan: string; pekerjaanLainnya: string
  isDisabilitas: "" | "Ya" | "Tidak"; jenisDisabilitas: string
  consent: boolean
  nq1: number; nq2: number; nq3: number; nq4: number; nq5: number
  nq6: number; nq7: number; nq8: number; nq9: number; nq10: number
  nq11a: number; nq11b: number; nq12a: number; nq12b: number
  nq13: number; nq14: number; nq15: number; nq16a: number; nq16b: number
  specificData: Record<string, number>
  kritikSaran: string
}

const EMPTY: FormData = {
  unitLayanan: "", nama: "", keperluan: "",
  phone: "", email: "", ageGroup: "", gender: "",
  education: "", pekerjaan: "", pekerjaanLainnya: "",
  isDisabilitas: "", jenisDisabilitas: "", consent: false,
  nq1: 0, nq2: 0, nq3: 0, nq4: 0, nq5: 0,
  nq6: 0, nq7: 0, nq8: 0, nq9: 0, nq10: 0,
  nq11a: 0, nq11b: 0, nq12a: 0, nq12b: 0,
  nq13: 0, nq14: 0, nq15: 0, nq16a: 0, nq16b: 0,
  specificData: {},
  kritikSaran: "",
}

const BASE_STEPS    = ["Verifikasi", "Unit Layanan", "Data Diri", "Penilaian", "Kirim"]
const HOUSING_STEPS = ["Verifikasi", "Unit Layanan", "Data Diri", "Penilaian", "Info Bantuan", "Kirim"]

// All new question ids for validation
const NEW_Q_IDS = [
  "nq1","nq2","nq3","nq4","nq5","nq6","nq7","nq8","nq9","nq10",
  "nq11a","nq11b","nq12a","nq12b","nq13","nq14","nq15","nq16a","nq16b",
] as const

export default function SurveyPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Buku Tamu lookup state
  const [lookupPhone, setLookupPhone] = useState("")
  const [looking, setLooking] = useState(false)
  const [lookupResult, setLookupResult] = useState<"idle" | "found" | "notfound">("idle")
  const [bukuTamuId, setBukuTamuId] = useState<number | null>(null)
  const [prefillName, setPrefillName] = useState("")
  // when prefilled, show data tambahan before jumping to penilaian
  const [showDataTambahan, setShowDataTambahan] = useState(false)

  const isHousingProgram = (HOUSING_PROGRAM_KEYS as readonly string[]).includes(form.unitLayanan)
  const activeSteps = isHousingProgram ? HOUSING_STEPS : BASE_STEPS
  const totalSteps = activeSteps.length
  const finalStep = totalSteps - 1

  const isSpecificStep = step === 4 && isHousingProgram
  const isFinalStep = step === finalStep

  const programQuestions = PROGRAM_SPECIFIC_QUESTIONS[form.unitLayanan] ?? []

  const effectivePekerjaan =
    form.pekerjaan === "Lainnya" ? form.pekerjaanLainnya.trim() : form.pekerjaan

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleLookup() {
    if (!lookupPhone || lookupPhone.trim().length < 8) {
      setError("Masukkan nomor HP yang valid (minimal 8 digit).")
      return
    }
    setError(""); setLooking(true)
    try {
      const res = await fetch(`/api/tamu?phone=${encodeURIComponent(lookupPhone.trim())}`)
      const data = await res.json()
      if (data.found) {
        setBukuTamuId(data.id)
        setPrefillName(data.nama)
        // Convert legacy education values to new format
        const edu = EDUCATION_LEGACY_MAP[data.education] ?? data.education
        // Derive age group from integer age
        const ageGrp = data.age ? getAgeGroup(data.age) : ""
        setForm((f) => ({
          ...f,
          nama: data.nama ?? "",
          phone: data.phone ?? lookupPhone.trim(),
          email: data.email ?? "",
          ageGroup: ageGrp,
          gender: data.gender ?? "",
          education: edu,
          unitLayanan: data.unitLayanan ?? "",
          keperluan: data.keperluan ?? "",
          consent: true,
        }))
        setLookupResult("found")
        setShowDataTambahan(true)
      } else {
        setLookupResult("notfound")
      }
    } catch {
      setError("Tidak dapat terhubung ke server.")
    } finally {
      setLooking(false)
    }
  }

  function handleDataTambahanNext() {
    if (!form.keperluan.trim()) { setError("Isi keperluan / tujuan kunjungan."); return }
    if (!form.pekerjaan) { setError("Pilih pekerjaan."); return }
    if (form.pekerjaan === "Lainnya" && !form.pekerjaanLainnya.trim()) {
      setError("Isi pekerjaan Lainnya."); return
    }
    if (!form.isDisabilitas) { setError("Pilih status disabilitas."); return }
    setError("")
    setStep(3)
    window.scrollTo(0, 0)
  }

  function skipToManual() {
    setLookupResult("idle")
    setShowDataTambahan(false)
    setError("")
    setStep(1)
    window.scrollTo(0, 0)
  }

  function validateStep(): string {
    if (step === 0) return "" // handled separately for found/not-found sub-states
    if (step === 1 && !form.unitLayanan) return "Pilih unit layanan terlebih dahulu."
    if (step === 2) {
      if (!form.nama || form.nama.trim().length < 2) return "Nama tidak valid."
      if (!form.keperluan || !form.keperluan.trim()) return "Isi keperluan / tujuan kunjungan."
      if (!form.phone || form.phone.trim().length < 8) return "Nomor HP tidak valid."
      if (!form.email || !form.email.includes("@")) return "Email tidak valid."
      if (!form.ageGroup) return "Pilih kelompok usia."
      if (!form.gender) return "Pilih jenis kelamin."
      if (!form.education) return "Pilih pendidikan terakhir."
      if (!form.pekerjaan) return "Pilih pekerjaan."
      if (form.pekerjaan === "Lainnya" && !form.pekerjaanLainnya.trim())
        return "Isi pekerjaan Lainnya."
      if (!form.isDisabilitas) return "Pilih status disabilitas."
      if (!form.consent) return "Anda harus menyetujui pernyataan persetujuan data."
    }
    if (step === 3) {
      for (const id of NEW_Q_IDS) {
        if (!form[id]) {
          const q = SURVEY_QUESTIONS.find((q) => q.id === id)
          return `Harap jawab pertanyaan: ${q?.label ?? id}`
        }
      }
    }
    if (isSpecificStep) {
      for (const q of programQuestions) {
        if (!form.specificData[q.id]) return `Harap jawab pertanyaan: ${q.label}`
      }
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
      const payload = {
        nama: form.nama,
        phone: form.phone,
        email: form.email,
        ageGroup: form.ageGroup,
        gender: form.gender,
        education: form.education,
        unitLayanan: form.unitLayanan,
        keperluan: form.keperluan || null,
        pekerjaan: effectivePekerjaan,
        isDisabilitas: form.isDisabilitas === "Ya",
        jenisDisabilitas: form.isDisabilitas === "Ya" && form.jenisDisabilitas
          ? form.jenisDisabilitas : null,
        nq1: form.nq1, nq2: form.nq2, nq3: form.nq3, nq4: form.nq4, nq5: form.nq5,
        nq6: form.nq6, nq7: form.nq7, nq8: form.nq8, nq9: form.nq9, nq10: form.nq10,
        nq11a: form.nq11a, nq11b: form.nq11b,
        nq12a: form.nq12a, nq12b: form.nq12b,
        nq13: form.nq13, nq14: form.nq14, nq15: form.nq15,
        nq16a: form.nq16a, nq16b: form.nq16b,
        q10a: form.kritikSaran || null,
        specificData: isHousingProgram && Object.keys(form.specificData).length > 0
          ? form.specificData : null,
        bukuTamuId,
      }
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.status === 409) { setError((await res.json()).error); setSubmitting(false); return }
      if (!res.ok) { setError((await res.json()).error ?? "Terjadi kesalahan."); setSubmitting(false); return }
      router.push("/survey/terima-kasih")
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.")
      setSubmitting(false)
    }
  }

  // Compute preview IKM score for summary step
  const previewIKM = (() => {
    const scores = NEW_Q_IDS.map((id) => form[id]).filter(Boolean) as number[]
    if (scores.length === 0) return null
    return ((scores.reduce((a, b) => a + b, 0) / scores.length) * 25).toFixed(1)
  })()

  return (
    <main className="min-h-screen" style={{ background: "#f5f7f8" }}>
      {/* Header */}
      <header style={{ background: "#113F51" }} className="shadow-md">
        <nav className="px-4 py-2.5 flex items-center gap-3 max-w-xl mx-auto">
          <Image src={LOGO_URL} alt="Logo" width={120} height={36} className="h-8 w-auto object-contain" unoptimized />
          <div className="border-l border-white/20 pl-3">
            <p className="text-white text-xs font-semibold leading-tight">{OFFICE_NAME}</p>
            <p className="text-white/50 text-xs">SKM {SURVEY_YEAR}</p>
          </div>
        </nav>
        <div style={{ background: "#D5C58A", height: "3px" }} />
      </header>

      {/* Step indicator */}
      <div style={{ background: "#0E5B73" }} className="px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-1">
          {activeSteps.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-0.5 transition-all ${
                i < step ? "bg-[#D5C58A] text-[#113F51]"
                : i === step ? "bg-white text-[#0E5B73]"
                : "bg-white/20 text-white/50"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-white font-semibold" : "text-white/40"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {error && (
          <div className="border-l-4 rounded-lg p-4 mb-4 text-sm"
            style={{ background: "#fff3cd", borderColor: "#CDB278", color: "#856404" }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Step 0: Verifikasi ── */}
        {step === 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
            <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
              <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Verifikasi Pendaftaran
              </h2>
              <p className="text-white/60 text-xs mt-0.5">Masukkan nomor HP yang Anda daftarkan di Buku Tamu</p>
            </div>
            <div className="p-6 space-y-4">
              {!showDataTambahan ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                    <input
                      type="tel" placeholder="08xxxxxxxxxx"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      value={lookupPhone}
                      onChange={(e) => { setLookupPhone(e.target.value); setLookupResult("idle") }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleLookup() } }}
                    />
                  </div>
                  {lookupResult === "notfound" && (
                    <div className="rounded-lg p-3 text-sm" style={{ background: "#fff3cd", borderLeft: "3px solid #CDB278", color: "#856404" }}>
                      Data tidak ditemukan untuk nomor ini hari ini. Silakan isi formulir secara manual.
                    </div>
                  )}
                  <button type="button" onClick={handleLookup} disabled={looking}
                    className="w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#0E5B73" }}>
                    {looking ? "Mencari..." : "Cari Data →"}
                  </button>
                  <div className="text-center">
                    <button type="button" onClick={skipToManual}
                      className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
                      Tidak terdaftar? Isi manual
                    </button>
                  </div>
                </>
              ) : (
                /* Data Tambahan setelah prefill ditemukan */
                <div className="space-y-4">
                  <div className="rounded-lg p-4 text-sm" style={{ background: "#d1fae5", borderLeft: "3px solid #16a34a" }}>
                    <p className="font-semibold text-green-800">Data ditemukan!</p>
                    <p className="text-green-700 mt-0.5">Halo, <strong>{prefillName}</strong>. Data Anda telah terisi otomatis.</p>
                    <p className="text-green-600 text-xs mt-1">Lengkapi data berikut untuk melanjutkan ke penilaian.</p>
                  </div>

                  {/* Keperluan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan / Tujuan Kunjungan *</label>
                    <input type="text" placeholder="Contoh: Konsultasi teknis perumahan"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      value={form.keperluan} onChange={(e) => set("keperluan", e.target.value)} />
                  </div>

                  {/* Pekerjaan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan *</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                      value={form.pekerjaan} onChange={(e) => set("pekerjaan", e.target.value)}>
                      <option value="">Pilih pekerjaan</option>
                      {PEKERJAAN_OPTIONS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                    {form.pekerjaan === "Lainnya" && (
                      <input type="text" placeholder="Sebutkan pekerjaan Anda"
                        className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                        value={form.pekerjaanLainnya} onChange={(e) => set("pekerjaanLainnya", e.target.value)} />
                    )}
                  </div>

                  {/* Disabilitas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apakah Anda penyandang disabilitas / pendamping penyandang disabilitas? *
                    </label>
                    <div className="flex gap-4">
                      {["Ya", "Tidak"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="disabilitas-step0" value={opt}
                            checked={form.isDisabilitas === opt}
                            onChange={() => set("isDisabilitas", opt as "Ya" | "Tidak")}
                            className="accent-[#0E5B73]" />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {form.isDisabilitas === "Ya" && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Disabilitas</label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                          value={form.jenisDisabilitas} onChange={(e) => set("jenisDisabilitas", e.target.value)}>
                          <option value="">Pilih jenis</option>
                          {DISABILITAS_OPTIONS.map((d) => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  <button type="button" onClick={handleDataTambahanNext}
                    className="w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90"
                    style={{ background: "#0E5B73" }}>
                    Lanjut ke Penilaian →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 1: Unit Layanan ── */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
            <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
              <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Langkah 2 — Unit Layanan
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Pilih layanan yang Anda gunakan:</p>
              <div className="space-y-3">
                {UNIT_LAYANAN_OPTIONS.map((opt) => (
                  <button key={opt} type="button" onClick={() => set("unitLayanan", opt)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                      form.unitLayanan === opt ? "text-white border-transparent" : "border-gray-200 bg-white text-gray-700 hover:border-[#0E5B73]"
                    }`}
                    style={form.unitLayanan === opt ? { background: "#0E5B73" } : {}}>
                    {form.unitLayanan === opt ? "✓ " : ""}{opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Data Diri ── */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
            <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
              <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Langkah 3 — Data Diri
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input type="text" placeholder="Nama sesuai identitas"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  value={form.nama} onChange={(e) => set("nama", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan / Tujuan Kunjungan *</label>
                <input type="text" placeholder="Contoh: Konsultasi teknis perumahan"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  value={form.keperluan} onChange={(e) => set("keperluan", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP *</label>
                <input type="tel" placeholder="08xxxxxxxxxx"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" placeholder="email@domain.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                  value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelompok Usia *</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                    value={form.ageGroup} onChange={(e) => set("ageGroup", e.target.value)}>
                    <option value="">Pilih usia</option>
                    {AGE_GROUPS.map((g) => <option key={g}>{g}</option>)}
                  </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan *</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                  value={form.pekerjaan} onChange={(e) => set("pekerjaan", e.target.value)}>
                  <option value="">Pilih pekerjaan</option>
                  {PEKERJAAN_OPTIONS.map((p) => <option key={p}>{p}</option>)}
                </select>
                {form.pekerjaan === "Lainnya" && (
                  <input type="text" placeholder="Sebutkan pekerjaan Anda"
                    className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    value={form.pekerjaanLainnya} onChange={(e) => set("pekerjaanLainnya", e.target.value)} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apakah Anda penyandang disabilitas / pendamping penyandang disabilitas? *
                </label>
                <div className="flex gap-4">
                  {["Ya", "Tidak"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="disabilitas-step2" value={opt}
                        checked={form.isDisabilitas === opt}
                        onChange={() => set("isDisabilitas", opt as "Ya" | "Tidak")}
                        className="accent-[#0E5B73]" />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
                {form.isDisabilitas === "Ya" && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Disabilitas</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white"
                      value={form.jenisDisabilitas} onChange={(e) => set("jenisDisabilitas", e.target.value)}>
                      <option value="">Pilih jenis</option>
                      {DISABILITAS_OPTIONS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="rounded-lg p-4 text-xs" style={{ background: "#f0f8fa", borderLeft: "3px solid #D5C58A" }}>
                <p className="text-gray-600 mb-2">
                  Data dan informasi yang Bapak/Ibu berikan hanya dipergunakan untuk kepentingan survei
                  dan dilindungi kerahasiaannya sesuai ketentuan yang berlaku.
                </p>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-[#0E5B73]"
                    checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
                  <span className="text-gray-700">
                    Saya menyetujui bahwa data yang saya berikan digunakan untuk keperluan Survei Kepuasan Masyarakat {OFFICE_NAME}.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Penilaian (19 pertanyaan hybrid) ── */}
        {step === 3 && (
          <div className="space-y-4">
            {bukuTamuId && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "#d1fae5", borderLeft: "3px solid #16a34a" }}>
                <span className="text-green-800 font-medium">Data diri terisi otomatis</span>
                <span className="text-green-700"> — silakan lanjutkan penilaian layanan.</span>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
              <div className="px-6 py-4" style={{ background: "#113F51" }}>
                <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {bukuTamuId ? "Langkah 2" : "Langkah 4"} — Penilaian Pelayanan
                </h2>
                <p className="text-white/60 text-xs mt-0.5">Pilih satu jawaban untuk setiap pertanyaan berikut</p>
              </div>
            </div>
            {SURVEY_QUESTIONS.map((q) => (
              <div key={q.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-2 border-b" style={{ borderColor: "#D5C58A" }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: "#0E5B73" }}>
                    {q.key}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: "#113F51" }}>{q.label}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <LikertOption key={opt.value} value={opt.value} label={opt.label}
                        selected={form[q.id as keyof FormData] === opt.value}
                        onChange={(val) => set(q.id as keyof FormData, val as never)} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 4 (housing only): Program-specific questions ── */}
        {isSpecificStep && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
              <div className="px-6 py-4" style={{ background: "#113F51" }}>
                <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Langkah 5 — Evaluasi Bantuan
                </h2>
                <p className="text-white/60 text-xs mt-0.5">{form.unitLayanan}</p>
              </div>
            </div>
            {programQuestions.map((q) => (
              <div key={q.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-2 border-b" style={{ borderColor: "#D5C58A" }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#D5C58A", color: "#113F51" }}>
                    {q.key}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: "#113F51" }}>{q.label}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <LikertOption key={opt.value} value={opt.value} label={opt.label}
                        selected={form.specificData[q.id] === opt.value}
                        onChange={(val) =>
                          set("specificData", { ...form.specificData, [q.id]: val as number })
                        } />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Final step: Kritik & Saran + Submit ── */}
        {isFinalStep && (
          <form onSubmit={submit}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
              <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
                <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Langkah {bukuTamuId ? "3" : String(totalSteps)} — Kritik dan Saran
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kritik dan Saran <span className="text-gray-400">(opsional)</span>
                  </label>
                  <textarea rows={4} placeholder="Tuliskan kritik dan saran Anda untuk perbaikan layanan kami..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none resize-none"
                    value={form.kritikSaran} onChange={(e) => set("kritikSaran", e.target.value)} />
                </div>

                <div className="rounded-lg p-4 text-sm" style={{ background: "#f0f8fa", borderLeft: "3px solid #D5C58A" }}>
                  <p className="font-semibold mb-1" style={{ color: "#113F51" }}>Ringkasan Jawaban:</p>
                  <p className="text-gray-600">Unit Layanan: <span className="font-medium">{form.unitLayanan}</span></p>
                  <p className="text-gray-600">Kelompok Usia: <span className="font-medium">{form.ageGroup}</span></p>
                  <p className="text-gray-600">Pekerjaan: <span className="font-medium">{effectivePekerjaan || "—"}</span></p>
                  {previewIKM && (
                    <p className="text-gray-600">
                      Nilai rata-rata SKM: <span className="font-medium">{previewIKM} / 100</span>
                    </p>
                  )}
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full py-3 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#0E5B73", fontFamily: "Poppins, sans-serif" }}>
                  {submitting ? "Mengirim..." : "Kirim Survei →"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          {step > 0 ? (
            <button type="button" onClick={prev}
              className="px-5 py-2.5 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50"
              style={{ borderColor: "#CDB278" }}>
              ← Kembali
            </button>
          ) : <div />}
          {!isFinalStep && step > 0 && (
            <button type="button" onClick={next}
              className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm hover:opacity-90"
              style={{ background: "#0E5B73" }}>
              Lanjut →
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
