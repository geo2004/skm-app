"use client"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import LikertOption from "@/components/survey/LikertOption"
import {
  SURVEY_QUESTIONS,
  UNIT_LAYANAN_OPTIONS,
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  HOUSING_PROGRAM_KEYS,
  PROGRAM_SPECIFIC_QUESTIONS,
  OFFICE_NAME,
  SURVEY_YEAR,
} from "@/lib/constants"

const LOGO_URL =
  "https://pkp.go.id/s3/website-perumahan/prod-storage/p2p-jawa-iii/logo_atas/01hr6kpg7t3q91g3b60f0e8qd2/01jsx5vvahcqwyxcgvz4bscjat.webp"

type FormData = {
  unitLayanan: string
  phone: string; email: string; age: string; gender: string; education: string; consent: boolean
  q1: number; q2: number; q3: number; q4: number; q5: number
  q6: number; q7: number; q8: number; q9: number
  specificData: Record<string, number>
  q10a: string; q10b: string
}

const EMPTY: FormData = {
  unitLayanan: "", phone: "", email: "", age: "", gender: "", education: "", consent: false,
  q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0,
  specificData: {},
  q10a: "", q10b: "",
}

const BASE_STEPS = ["Unit Layanan", "Data Diri", "Penilaian", "Catatan & Kirim"]
const HOUSING_STEPS = ["Unit Layanan", "Data Diri", "Penilaian", "Info Bantuan", "Catatan & Kirim"]

export default function SurveyPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isHousingProgram = (HOUSING_PROGRAM_KEYS as readonly string[]).includes(form.unitLayanan)
  const activeSteps = isHousingProgram ? HOUSING_STEPS : BASE_STEPS
  const totalSteps = activeSteps.length
  const finalStep = totalSteps - 1

  // Step 3 is housing-specific questions when housing program is selected
  // Otherwise step 3 is the final open-ended step
  const isSpecificStep = step === 3 && isHousingProgram
  const isFinalStep = step === finalStep

  const programQuestions = PROGRAM_SPECIFIC_QUESTIONS[form.unitLayanan] ?? []

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function validateStep(): string {
    if (step === 0 && !form.unitLayanan) return "Pilih unit layanan terlebih dahulu."
    if (step === 1) {
      if (!form.phone || form.phone.trim().length < 8) return "Nomor HP tidak valid."
      if (!form.email || !form.email.includes("@")) return "Email tidak valid."
      const age = Number(form.age)
      if (!Number.isInteger(age) || age < 15 || age > 100) return "Usia harus antara 15–100 tahun."
      if (!form.gender) return "Pilih jenis kelamin."
      if (!form.education) return "Pilih pendidikan terakhir."
      if (!form.consent) return "Anda harus menyetujui pernyataan persetujuan data."
    }
    if (step === 2) {
      for (const q of SURVEY_QUESTIONS) {
        if (!(form[q.id as keyof FormData] as number)) return `Harap jawab pertanyaan: ${q.label}`
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
        ...form,
        age: Number(form.age),
        q10a: form.q10a || null,
        q10b: form.q10b || null,
        specificData: isHousingProgram && Object.keys(form.specificData).length > 0
          ? form.specificData
          : null,
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
        {/* Gold accent line */}
        <div style={{ background: "#D5C58A", height: "3px" }} />
      </header>

      {/* Step indicator */}
      <div style={{ background: "#0E5B73" }} className="px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-1">
          {activeSteps.map((label, i) => (
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

      <div className="max-w-xl mx-auto px-4 py-6">
        {error && (
          <div
            className="border-l-4 rounded-lg p-4 mb-4 text-sm"
            style={{ background: "#fff3cd", borderColor: "#CDB278", color: "#856404" }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Step 0: Unit Layanan */}
        {step === 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
            <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
              <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Langkah 1 — Unit Layanan
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Pilih layanan yang Anda gunakan:</p>
              <div className="space-y-3">
                {UNIT_LAYANAN_OPTIONS.map((opt) => (
                  <button
                    key={opt} type="button" onClick={() => set("unitLayanan", opt)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                      form.unitLayanan === opt
                        ? "text-white border-transparent"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#0E5B73]"
                    }`}
                    style={form.unitLayanan === opt ? { background: "#0E5B73" } : {}}
                  >
                    {form.unitLayanan === opt ? "✓ " : ""}{opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Data Diri */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
            <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
              <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                Langkah 2 — Data Diri
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP *</label>
                <input type="tel" placeholder="08xxxxxxxxxx"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "#0E5B73" }}
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

        {/* Step 2: Penilaian (9 unsur SKM) */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
              <div className="px-6 py-4" style={{ background: "#113F51" }}>
                <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Langkah 3 — Penilaian Pelayanan
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

        {/* Step 3 (housing only): Program-specific questions */}
        {isSpecificStep && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
              <div className="px-6 py-4" style={{ background: "#113F51" }}>
                <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Langkah 4 — Evaluasi Bantuan
                </h2>
                <p className="text-white/60 text-xs mt-0.5">{form.unitLayanan}</p>
              </div>
            </div>
            {programQuestions.map((q) => (
              <div key={q.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-2 border-b" style={{ borderColor: "#D5C58A" }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: "#D5C58A", color: "#113F51" }}>
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

        {/* Final step: Open-ended + Submit */}
        {isFinalStep && (
          <form onSubmit={submit}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderBottom: "3px solid #D5C58A" }}>
              <div className="px-6 py-4 border-b" style={{ background: "#113F51" }}>
                <h2 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Langkah {totalSteps} — Masukan Anda
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hal apa yang Anda rasa kurang berkenan pada pelayanan kami?
                  </label>
                  <textarea rows={3} placeholder="Tuliskan masukan Anda (opsional)..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none resize-none"
                    value={form.q10a} onChange={(e) => set("q10a", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hal apa yang Anda rasa paling berkesan pada pelayanan kami?
                  </label>
                  <textarea rows={3} placeholder="Tuliskan kesan Anda (opsional)..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none resize-none"
                    value={form.q10b} onChange={(e) => set("q10b", e.target.value)} />
                </div>

                {/* Summary */}
                <div className="rounded-lg p-4 text-sm" style={{ background: "#f0f8fa", borderLeft: "3px solid #D5C58A" }}>
                  <p className="font-semibold mb-1" style={{ color: "#113F51" }}>Ringkasan Jawaban:</p>
                  <p className="text-gray-600">Unit Layanan: <span className="font-medium">{form.unitLayanan}</span></p>
                  <p className="text-gray-600">
                    Nilai rata-rata SKM:{" "}
                    <span className="font-medium">
                      {(([form.q1,form.q2,form.q3,form.q4,form.q5,form.q6,form.q7,form.q8,form.q9]
                        .reduce((a,b)=>a+b,0)/9)*25).toFixed(1)} / 100
                    </span>
                  </p>
                  {isHousingProgram && Object.keys(form.specificData).length > 0 && (
                    <p className="text-gray-600">
                      Pertanyaan bantuan:{" "}
                      <span className="font-medium">
                        {Object.keys(form.specificData).length} / {programQuestions.length} dijawab
                      </span>
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
          {!isFinalStep && (
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
