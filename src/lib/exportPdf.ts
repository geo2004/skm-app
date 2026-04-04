import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { SURVEY_QUESTIONS, OFFICE_NAME, OFFICE_FULL_NAME, MINISTRY, SURVEY_YEAR } from "./constants"
import { computeIKM, computeDemographics } from "./ikm"

type ResponseRow = {
  id: number
  createdAt: Date
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
}

const NAVY: [number, number, number] = [26, 58, 107]
const GOLD: [number, number, number] = [245, 166, 35]

function addPageHeader(doc: jsPDF, title: string) {
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, 210, 18, "F")
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text(`${OFFICE_NAME} — ${title}`, 105, 11, { align: "center" })
  doc.setTextColor(0, 0, 0)
}

function addPageFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(100)
    doc.text(
      `Halaman ${i} dari ${pageCount}  |  ${OFFICE_NAME}  |  Survei Kepuasan Masyarakat ${SURVEY_YEAR}`,
      105, 290, { align: "center" }
    )
    doc.setTextColor(0, 0, 0)
  }
}

export function buildPdfReport(responses: ResponseRow[]): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const ikm = computeIKM(responses)
  const demographics = computeDemographics(responses)

  // ── Cover Page ────────────────────────────────────────────────────────────
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, 210, 297, "F")

  doc.setFillColor(...GOLD)
  doc.rect(0, 100, 210, 60, "F")

  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.text("LAPORAN PELAKSANAAN", 105, 75, { align: "center" })
  doc.text("SURVEI KEPUASAN MASYARAKAT (SKM)", 105, 85, { align: "center" })

  doc.setTextColor(...NAVY)
  doc.setFontSize(16)
  doc.text(OFFICE_NAME, 105, 120, { align: "center" })
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(OFFICE_FULL_NAME, 105, 132, { align: "center" })
  doc.text(MINISTRY, 105, 140, { align: "center" })

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(`TAHUN ${SURVEY_YEAR}`, 105, 200, { align: "center" })

  if (ikm) {
    doc.setFontSize(28)
    doc.text(`IKM: ${ikm.ikmUnit.toFixed(2)}`, 105, 225, { align: "center" })
    doc.setFontSize(14)
    doc.text(`Kategori ${ikm.category.label} — ${ikm.category.name}`, 105, 238, { align: "center" })
  }

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(`Jumlah Responden: ${responses.length}`, 105, 260, { align: "center" })

  // ── BAB I: Pendahuluan ────────────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB I: Pendahuluan")

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BAB I  PENDAHULUAN", 20, 30)

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("A. Latar Belakang", 20, 42)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const bg = doc.splitTextToSize(
    `Survei Kepuasan Masyarakat (SKM) merupakan kegiatan pengukuran secara komprehensif tentang ` +
    `tingkat kepuasan masyarakat terhadap kualitas layanan yang diberikan oleh penyelenggara pelayanan publik. ` +
    `Pelaksanaan SKM didasarkan pada Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi ` +
    `(Permenpan-RB) Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit ` +
    `Penyelenggara Pelayanan Publik. ${OFFICE_NAME} berkomitmen untuk senantiasa meningkatkan kualitas ` +
    `pelayanan berdasarkan masukan dan penilaian dari masyarakat pengguna layanan.`,
    170
  )
  doc.text(bg, 20, 52)

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("B. Dasar Hukum", 20, 105)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const dasar = [
    "1. Undang-Undang No. 25 Tahun 2009 tentang Pelayanan Publik",
    "2. Peraturan Pemerintah No. 96 Tahun 2012 tentang Pelaksanaan UU Pelayanan Publik",
    "3. Permenpan-RB No. 14 Tahun 2017 tentang Pedoman Penyusunan SKM",
  ]
  dasar.forEach((line, i) => doc.text(line, 20, 115 + i * 8))

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("C. Tujuan", 20, 145)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const tujuan = doc.splitTextToSize(
    `SKM ini bertujuan untuk: (1) mengetahui tingkat kepuasan masyarakat terhadap pelayanan ` +
    `${OFFICE_NAME}; (2) memetakan unsur pelayanan yang perlu ditingkatkan; dan (3) memberikan ` +
    `rekomendasi perbaikan layanan secara berkelanjutan.`,
    170
  )
  doc.text(tujuan, 20, 155)

  // ── BAB II: Pengumpulan Data ──────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB II: Pengumpulan Data")

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BAB II  PENGUMPULAN DATA", 20, 30)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const metode = doc.splitTextToSize(
    `Survei dilaksanakan secara daring melalui aplikasi web SKM ${OFFICE_NAME}. ` +
    `Responden merupakan pengguna layanan aktif pada ${SURVEY_YEAR}. ` +
    `Kuesioner terdiri atas 9 (sembilan) unsur pelayanan berdasarkan Permenpan-RB No. 14/2017 ` +
    `dan 2 pertanyaan terbuka untuk masukan kualitatif.`,
    170
  )
  doc.text(metode, 20, 42)

  autoTable(doc, {
    startY: 80,
    head: [["Keterangan", "Isi"]],
    body: [
      ["Jumlah Responden", `${responses.length} orang`],
      ["Metode Survei", "Daring (online)"],
      ["Tahun Survei", SURVEY_YEAR],
      ["Skala Penilaian", "1–4 (Likert 4 poin)"],
      ["Jumlah Unsur", "9 Unsur (Permenpan-RB No. 14/2017)"],
    ],
    headStyles: { fillColor: NAVY },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  })

  // ── BAB III: Hasil Pengolahan ─────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB III: Hasil Pengolahan")

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BAB III  HASIL PENGOLAHAN DATA", 20, 30)

  if (ikm) {
    autoTable(doc, {
      startY: 40,
      head: [["No", "Unsur Pelayanan", "NRR", "IKM per Unsur", "Kategori"]],
      body: ikm.unsur.map((u, i) => [
        i + 1,
        `${u.key}: ${u.label}`,
        u.nrr.toFixed(2),
        u.ikm.toFixed(2),
        `${u.category.label} – ${u.category.name}`,
      ]),
      foot: [["", "IKM UNIT LAYANAN", "", ikm.ikmUnit.toFixed(2), `${ikm.category.label} – ${ikm.category.name}`]],
      headStyles: { fillColor: NAVY },
      footStyles: { fillColor: GOLD, textColor: [0, 0, 0], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    })
  }

  // ── BAB IV: Analisis ──────────────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB IV: Analisis")

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BAB IV  ANALISIS", 20, 30)

  if (ikm) {
    const best = [...ikm.unsur].sort((a, b) => b.ikm - a.ikm).slice(0, 3)
    const worst = [...ikm.unsur].sort((a, b) => a.ikm - b.ikm).slice(0, 3)

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("A. Unsur dengan Nilai Tertinggi", 20, 42)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    best.forEach((u, i) => {
      doc.text(`${i + 1}. ${u.key}: ${u.label} — IKM ${u.ikm.toFixed(2)} (${u.category.name})`, 25, 52 + i * 8)
    })

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("B. Unsur yang Perlu Ditingkatkan", 20, 82)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    worst.forEach((u, i) => {
      doc.text(`${i + 1}. ${u.key}: ${u.label} — IKM ${u.ikm.toFixed(2)} (${u.category.name})`, 25, 92 + i * 8)
    })

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("C. Profil Demografi Responden", 20, 122)

    const genderData = Object.entries(demographics.gender).map(([k, v]) => [k, `${v} orang`])
    const educData = Object.entries(demographics.education).map(([k, v]) => [k, `${v} orang`])

    autoTable(doc, {
      startY: 130,
      head: [["Jenis Kelamin", "Jumlah"]],
      body: genderData,
      headStyles: { fillColor: NAVY },
      tableWidth: 80,
      margin: { left: 20 },
    })

    autoTable(doc, {
      startY: 130,
      head: [["Pendidikan", "Jumlah"]],
      body: educData,
      headStyles: { fillColor: NAVY },
      tableWidth: 80,
      margin: { left: 110 },
    })
  }

  // ── BAB V: Kesimpulan ─────────────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB V: Kesimpulan")

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BAB V  KESIMPULAN DAN REKOMENDASI", 20, 30)

  if (ikm) {
    const kesimpulan = doc.splitTextToSize(
      `Berdasarkan hasil Survei Kepuasan Masyarakat (SKM) Tahun ${SURVEY_YEAR} yang melibatkan ` +
      `${ikm.n} responden pengguna layanan ${OFFICE_NAME}, diperoleh Indeks Kepuasan Masyarakat ` +
      `(IKM) Unit Layanan sebesar ${ikm.ikmUnit.toFixed(2)} yang masuk dalam kategori ` +
      `"${ikm.category.label} – ${ikm.category.name}". ` +
      `Hasil ini mencerminkan bahwa secara umum masyarakat pengguna layanan merasa ` +
      `${ikm.category.name.toLowerCase()} terhadap kualitas pelayanan ${OFFICE_NAME}. ` +
      `Unsur dengan nilai IKM tertinggi adalah ${ikm.unsur.sort((a,b)=>b.ikm-a.ikm)[0].label} ` +
      `(${ikm.unsur.sort((a,b)=>b.ikm-a.ikm)[0].ikm.toFixed(2)}), sementara unsur yang masih ` +
      `perlu mendapat perhatian adalah ${ikm.unsur.sort((a,b)=>a.ikm-b.ikm)[0].label} ` +
      `(${ikm.unsur.sort((a,b)=>a.ikm-b.ikm)[0].ikm.toFixed(2)}). ` +
      `Diharapkan hasil survei ini dapat menjadi dasar perbaikan dan peningkatan kualitas ` +
      `pelayanan ${OFFICE_NAME} secara berkelanjutan.`,
      170
    )
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(kesimpulan, 20, 42)
  }

  // ── Lampiran: Tabel Data Lengkap ──────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "Lampiran: Data Responden")

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("LAMPIRAN — DATA RESPONDEN", 20, 30)

  autoTable(doc, {
    startY: 38,
    head: [[
      "No", "Tanggal", "Gender", "Usia", "Pendidikan",
      "U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9",
    ]],
    body: responses.map((r, i) => [
      i + 1,
      r.createdAt.toLocaleDateString("id-ID"),
      r.gender === "Laki-laki" ? "L" : "P",
      r.age,
      r.education.split(" ")[0],
      r.q1, r.q2, r.q3, r.q4, r.q5, r.q6, r.q7, r.q8, r.q9,
    ]),
    headStyles: { fillColor: NAVY },
    styles: { fontSize: 7, cellPadding: 2 },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  })

  addPageFooter(doc)

  return Buffer.from(doc.output("arraybuffer"))
}
