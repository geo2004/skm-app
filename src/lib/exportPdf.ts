import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { OFFICE_NAME, OFFICE_FULL_NAME, MINISTRY, SURVEY_YEAR, IKM_UNSUR_LABELS } from "./constants"
import { computeIKM, computeDemographics, getResponseUnsurScores } from "./ikm"

type ResponseRow = {
  id: number
  createdAt: Date
  nama: string | null; keperluan: string | null
  phone: string; email: string
  age: number | null; ageGroup: string | null
  gender: string; education: string; unitLayanan: string
  pekerjaan: string | null
  isDisabilitas: boolean | null; jenisDisabilitas: string | null
  q1: number | null; q2: number | null; q3: number | null
  q4: number | null; q5: number | null; q6: number | null
  q7: number | null; q8: number | null; q9: number | null
  q10a: string | null; q10b: string | null
  nq1: number | null; nq2: number | null; nq3: number | null
  nq4: number | null; nq5: number | null; nq6: number | null
  nq7: number | null; nq8: number | null; nq9: number | null; nq10: number | null
  nq11a: number | null; nq11b: number | null
  nq12a: number | null; nq12b: number | null; nq13: number | null
  nq14: number | null; nq15: number | null
  nq16a: number | null; nq16b: number | null
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

  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0)
  doc.text("BAB I  PENDAHULUAN", 20, 30)

  doc.setFontSize(11); doc.setFont("helvetica", "bold")
  doc.text("1.1 Latar Belakang", 20, 42)
  doc.setFontSize(10); doc.setFont("helvetica", "normal")
  doc.text(doc.splitTextToSize(
    `Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik dan Peraturan Pemerintah Nomor 96 ` +
    `Tahun 2012 tentang Pelaksanaan Undang-undang Nomor 25 Tahun 2009 tentang Pelayanan Publik, ` +
    `mengamanatkan penyelenggara wajib mengikutsertakan masyarakat dalam penyelenggaraan Pelayanan ` +
    `Publik. Untuk menjalankan amanat tersebut, disusun Peraturan Menteri PANRB No. 14 Tahun 2017 ` +
    `tentang Pedoman Penyusunan Survei Kepuasan Masyarakat (SKM) Unit Penyelenggara Pelayanan Publik.`,
    170
  ), 20, 52)

  doc.setFontSize(11); doc.setFont("helvetica", "bold")
  doc.text("1.2 Tujuan dan Manfaat", 20, 92)
  doc.setFontSize(10); doc.setFont("helvetica", "normal")
  const tujuan = [
    "a. Mengidentifikasi kelemahan dalam penyelenggaraan pelayanan;",
    "b. Mengetahui kinerja pelayanan yang telah dilaksanakan secara periodik;",
    "c. Mengetahui indeks kepuasan masyarakat pada unit pelayanan;",
    "d. Menjadi dasar penetapan kebijakan maupun perbaikan kualitas pelayanan.",
  ]
  tujuan.forEach((t, i) => doc.text(t, 22, 102 + i * 8))

  doc.setFontSize(11); doc.setFont("helvetica", "bold")
  doc.text("1.3 Metode Pengumpulan Data", 20, 142)
  doc.setFontSize(10); doc.setFont("helvetica", "normal")
  doc.text(doc.splitTextToSize(
    `Pelaksanaan SKM menggunakan kuesioner hybrid (campuran) secara elektronik dan nonelektronik ` +
    `yang disebarkan kepada pengguna layanan. Kuesioner terdiri atas 19 sub-pertanyaan yang dipetakan ` +
    `ke dalam 9 unsur pengukuran kepuasan masyarakat berdasarkan Permenpan-RB No. 14 Tahun 2017.`,
    170
  ), 20, 152)

  autoTable(doc, {
    startY: 180,
    head: [["Keterangan", "Isi"]],
    body: [
      ["Jumlah Responden", `${responses.length} orang`],
      ["Metode Survei", "Hybrid (Elektronik & Nonelektronik)"],
      ["Tahun Survei", SURVEY_YEAR],
      ["Skala Penilaian", "1–4 (Likert 4 poin)"],
      ["Jumlah Unsur IKM", "9 Unsur (Permenpan-RB No. 14/2017)"],
      ["Jumlah Sub-Pertanyaan", "19 Sub-pertanyaan"],
    ],
    headStyles: { fillColor: NAVY },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  })

  // ── BAB II: Analisis Responden ────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB II: Analisis Data SKM")

  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0)
  doc.text("BAB II  ANALISIS DATA SKM", 20, 30)

  doc.setFontSize(11); doc.setFont("helvetica", "bold")
  doc.text("2.1 Analisis Responden", 20, 42)

  function demoRows(counts: Record<string, number>) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return Object.entries(counts).map(([k, v]) => [
      k, String(v), `${((v / total) * 100).toFixed(1)}%`,
    ])
  }

  let demoY = 50
  const demoSections: Array<{ title: string; rows: string[][] }> = [
    { title: "Jenis Kelamin", rows: demoRows(demographics.gender) },
    { title: "Kelompok Usia", rows: demoRows(Object.fromEntries(Object.entries(demographics.ageGroup).filter(([, v]) => v > 0))) },
    { title: "Pendidikan", rows: demoRows(demographics.education) },
    ...(Object.keys(demographics.pekerjaan).length > 0 ? [{ title: "Pekerjaan", rows: demoRows(demographics.pekerjaan) }] : []),
    ...(Object.keys(demographics.disabilitas).length > 0 ? [{ title: "Status Disabilitas", rows: demoRows(demographics.disabilitas) }] : []),
  ]

  for (const section of demoSections) {
    autoTable(doc, {
      startY: demoY,
      head: [[section.title, "Jumlah", "Persentase"]],
      body: section.rows,
      headStyles: { fillColor: NAVY },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      styles: { fontSize: 9 },
      margin: { left: 20, right: 20 },
    })
    demoY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6
  }

  // ── BAB II: IKM per Unsur ─────────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB II: IKM per Unsur")

  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0)
  doc.text("2.2 Indeks Kepuasan Masyarakat Per Unsur Pelayanan", 20, 30)

  if (ikm) {
    autoTable(doc, {
      startY: 38,
      head: [["No", "Unsur Pelayanan", "NRR", "IKM per Unsur", "Kategori"]],
      body: ikm.unsur.map((u, i) => [
        i + 1, `${u.key}: ${u.label}`,
        u.nrr.toFixed(2), u.ikm.toFixed(2),
        `${u.category.label} – ${u.category.name}`,
      ]),
      foot: [["", "IKM UNIT LAYANAN", "", ikm.ikmUnit.toFixed(2), `${ikm.category.label} – ${ikm.category.name}`]],
      headStyles: { fillColor: NAVY },
      footStyles: { fillColor: GOLD, textColor: [0, 0, 0], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    })

    const best = [...ikm.unsur].sort((a, b) => b.ikm - a.ikm).slice(0, 3)
    const worst = [...ikm.unsur].sort((a, b) => a.ikm - b.ikm).slice(0, 3)

    const afterY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12

    doc.setFontSize(11); doc.setFont("helvetica", "bold")
    doc.text("2.3 Analisis Masalah dan Rencana Tindak Lanjut", 20, afterY)
    doc.setFontSize(10); doc.setFont("helvetica", "normal")
    doc.text("Unsur dengan nilai tertinggi:", 20, afterY + 10)
    best.forEach((u, i) => {
      doc.text(`${i + 1}. ${u.key}: ${u.label} — IKM ${u.ikm.toFixed(2)} (${u.category.name})`, 25, afterY + 18 + i * 8)
    })
    doc.text("Unsur yang perlu ditingkatkan:", 20, afterY + 48)
    worst.forEach((u, i) => {
      doc.text(`${i + 1}. ${u.key}: ${u.label} — IKM ${u.ikm.toFixed(2)} (${u.category.name})`, 25, afterY + 56 + i * 8)
    })
  }

  // ── BAB III: Tindak Lanjut ────────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB III: Hasil Tindak Lanjut")

  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0)
  doc.text("BAB III  HASIL TINDAK LANJUT SKM PERIODE SEBELUMNYA", 20, 30)

  if (ikm) {
    autoTable(doc, {
      startY: 40,
      head: [["No", "Unsur", "IKM"]],
      body: ikm.unsur.map((u, i) => [i + 1, u.label, u.ikm.toFixed(2)]),
      headStyles: { fillColor: NAVY },
    })
  }

  autoTable(doc, {
    startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10,
    head: [["No", "Rencana Tindak Lanjut", "Status", "Deskripsi Tindak Lanjut"]],
    body: [["1", "", "", ""], ["2", "", "", ""], ["3", "", "", ""]],
    headStyles: { fillColor: NAVY },
    styles: { minCellHeight: 20 },
  })

  // ── BAB IV: Kesimpulan ────────────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "BAB IV: Kesimpulan")

  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0)
  doc.text("BAB IV  KESIMPULAN", 20, 30)

  if (ikm) {
    const sortedDesc = [...ikm.unsur].sort((a, b) => b.ikm - a.ikm)
    const sortedAsc = [...ikm.unsur].sort((a, b) => a.ikm - b.ikm)
    doc.setFontSize(10); doc.setFont("helvetica", "normal")
    doc.text(doc.splitTextToSize(
      `Berdasarkan hasil Survei Kepuasan Masyarakat (SKM) Tahun ${SURVEY_YEAR} yang melibatkan ` +
      `${ikm.n} responden pengguna layanan ${OFFICE_NAME}, diperoleh Indeks Kepuasan Masyarakat ` +
      `(IKM) Unit Layanan sebesar ${ikm.ikmUnit.toFixed(2)} yang masuk dalam kategori ` +
      `"${ikm.category.label} – ${ikm.category.name}". ` +
      `Unsur dengan nilai IKM tertinggi adalah ${sortedDesc[0].label} (${sortedDesc[0].ikm.toFixed(2)}), ` +
      `sementara unsur yang masih perlu mendapat perhatian adalah ${sortedAsc[0].label} (${sortedAsc[0].ikm.toFixed(2)}). ` +
      `Unsur prioritas perbaikan: ${sortedAsc.slice(0, 3).map(u => u.label).join(", ")}.`,
      170
    ), 20, 42)
  }

  // ── Lampiran: Data Responden ──────────────────────────────────────────────
  doc.addPage()
  addPageHeader(doc, "Lampiran: Data Responden")

  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0)
  doc.text("LAMPIRAN — DATA RESPONDEN", 20, 30)

  autoTable(doc, {
    startY: 38,
    head: [[
      "No", "Nama", "Tanggal", "Unit Layanan", "Keperluan", "Gender", "Usia",
      ...IKM_UNSUR_LABELS.map((u) => u.key),
      "IKM",
    ]],
    body: responses.map((r, i) => {
      const scores = getResponseUnsurScores(r)
      const valid = scores.filter((s): s is number => s != null)
      const ikmAvg = valid.length > 0
        ? (valid.reduce((a, b) => a + b, 0) / valid.length) * 25
        : null
      return [
        i + 1,
        r.nama ?? "—",
        r.createdAt.toLocaleDateString("id-ID"),
        r.unitLayanan,
        r.keperluan ?? "—",
        r.gender === "Laki-laki" ? "L" : "P",
        r.ageGroup ?? r.age ?? "—",
        ...scores.map((s) => s != null ? s.toFixed(1) : "—"),
        ikmAvg != null ? ikmAvg.toFixed(1) : "—",
      ]
    }),
    headStyles: { fillColor: NAVY },
    styles: { fontSize: 6.5, cellPadding: 1.5 },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 30 },
      2: { cellWidth: 18 },
      3: { cellWidth: 30 },
      4: { cellWidth: 28 },
      5: { cellWidth: 8 },
      6: { cellWidth: 12 },
    },
  })

  addPageFooter(doc)

  return Buffer.from(doc.output("arraybuffer"))
}
