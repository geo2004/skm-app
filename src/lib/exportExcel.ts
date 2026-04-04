import ExcelJS from "exceljs"
import { SURVEY_QUESTIONS, OFFICE_NAME, SURVEY_YEAR } from "./constants"
import { computeIKM } from "./ikm"

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

const NAVY = "FF1A3A6B"
const GOLD = "FFF5A623"
const WHITE = "FFFFFFFF"
const RED_LIGHT = "FFFFC7CE"
const GREEN_LIGHT = "FFC6EFCE"

export async function buildExcelWorkbook(responses: ResponseRow[]): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook()
  wb.creator = OFFICE_NAME
  wb.created = new Date()

  // ── Sheet 1: Data Responden ───────────────────────────────────────────────
  const ws1 = wb.addWorksheet("Data Responden")

  // Title row
  ws1.mergeCells("A1:U1")
  const titleCell = ws1.getCell("A1")
  titleCell.value = `DATA RESPONDEN SKM ${OFFICE_NAME} TAHUN ${SURVEY_YEAR}`
  titleCell.font = { bold: true, size: 12, color: { argb: WHITE } }
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } }
  titleCell.alignment = { horizontal: "center", vertical: "middle" }
  ws1.getRow(1).height = 30

  // Header row
  const headers = [
    "No", "Tanggal", "Nomor HP", "Email", "Usia", "Jenis Kelamin",
    "Pendidikan", "Unit Layanan",
    ...SURVEY_QUESTIONS.map((q) => `${q.key}: ${q.label}`),
    "Catatan Negatif", "Catatan Positif",
  ]

  const headerRow = ws1.addRow(headers)
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: WHITE } }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } }
    cell.alignment = { horizontal: "center", wrapText: true }
    cell.border = {
      top: { style: "thin" }, left: { style: "thin" },
      bottom: { style: "thin" }, right: { style: "thin" },
    }
  })
  ws1.getRow(2).height = 36

  // Data rows
  responses.forEach((r, idx) => {
    const row = ws1.addRow([
      idx + 1,
      r.createdAt.toLocaleDateString("id-ID"),
      r.phone, r.email, r.age, r.gender, r.education, r.unitLayanan,
      r.q1, r.q2, r.q3, r.q4, r.q5, r.q6, r.q7, r.q8, r.q9,
      r.q10a ?? "", r.q10b ?? "",
    ])

    // Conditional formatting for Likert scores (cols I–Q = 9–17)
    for (let col = 9; col <= 17; col++) {
      const cell = row.getCell(col)
      const val = cell.value as number
      cell.alignment = { horizontal: "center" }
      cell.fill = {
        type: "pattern", pattern: "solid",
        fgColor: { argb: val <= 2 ? RED_LIGHT : GREEN_LIGHT },
      }
    }
  })

  // Column widths
  ws1.getColumn(1).width = 5
  ws1.getColumn(2).width = 14
  ws1.getColumn(3).width = 16
  ws1.getColumn(4).width = 24
  ws1.getColumn(5).width = 7
  ws1.getColumn(6).width = 14
  ws1.getColumn(7).width = 20
  ws1.getColumn(8).width = 30
  for (let i = 9; i <= 17; i++) ws1.getColumn(i).width = 12
  ws1.getColumn(18).width = 35
  ws1.getColumn(19).width = 35

  ws1.autoFilter = { from: "A2", to: `S2` }
  ws1.views = [{ state: "frozen", ySplit: 2 }]

  // ── Sheet 2: Rekapitulasi IKM ─────────────────────────────────────────────
  const ws2 = wb.addWorksheet("Rekapitulasi IKM")

  ws2.mergeCells("A1:G1")
  const t2 = ws2.getCell("A1")
  t2.value = `REKAPITULASI IKM ${OFFICE_NAME} TAHUN ${SURVEY_YEAR}`
  t2.font = { bold: true, size: 12, color: { argb: WHITE } }
  t2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } }
  t2.alignment = { horizontal: "center", vertical: "middle" }
  ws2.getRow(1).height = 30

  // Sub-header
  ws2.addRow(["No", "Unsur Pelayanan", "Jumlah Nilai", "NRR per Unsur", "IKM per Unsur", "Kategori", "Keterangan"])
  ws2.getRow(2).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: WHITE } }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } }
    cell.alignment = { horizontal: "center", wrapText: true }
    cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
  })

  const ikm = computeIKM(responses)

  if (ikm) {
    ikm.unsur.forEach((u, i) => {
      const row = ws2.addRow([
        i + 1, `${u.key}: ${u.label}`,
        Math.round(u.nrr * responses.length * 100) / 100,
        u.nrr, u.ikm, u.category.label, u.category.name,
      ])
      row.getCell(4).numFmt = "0.00"
      row.getCell(5).numFmt = "0.00"
      row.eachCell((cell) => {
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
      })
    })

    // IKM Unit total row
    ws2.addRow([])
    const totalRow = ws2.addRow(["", "IKM UNIT LAYANAN", "", "", ikm.ikmUnit, ikm.category.label, ikm.category.name])
    totalRow.font = { bold: true }
    totalRow.getCell(5).numFmt = "0.00"
    totalRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } }
    })

    ws2.addRow([])
    ws2.addRow(["Jumlah Responden:", responses.length])
    ws2.addRow(["Tanggal Cetak:", new Date().toLocaleDateString("id-ID")])
  }

  ws2.getColumn(1).width = 5
  ws2.getColumn(2).width = 36
  ws2.getColumn(3).width = 14
  ws2.getColumn(4).width = 14
  ws2.getColumn(5).width = 14
  ws2.getColumn(6).width = 10
  ws2.getColumn(7).width = 16

  return await wb.xlsx.writeBuffer()
}
