import ExcelJS from "exceljs"
import { OFFICE_NAME, SURVEY_YEAR, IKM_UNSUR_LABELS } from "./constants"
import { computeIKM, getResponseUnsurScores } from "./ikm"

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

const NAVY = "FF1A3A6B"
const GOLD = "FFF5A623"
const WHITE = "FFFFFFFF"
const RED_LIGHT = "FFFFC7CE"
const GREEN_LIGHT = "FFC6EFCE"
const GRAY_LIGHT = "FFD3D3D3"

const cellBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin" }, left: { style: "thin" },
  bottom: { style: "thin" }, right: { style: "thin" },
}

function headerStyle(cell: ExcelJS.Cell) {
  cell.font = { bold: true, color: { argb: WHITE } }
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } }
  cell.alignment = { horizontal: "center", wrapText: true }
  cell.border = cellBorder
}

export async function buildExcelWorkbook(responses: ResponseRow[]): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook()
  wb.creator = OFFICE_NAME
  wb.created = new Date()

  // ── Sheet 1: Data Responden ───────────────────────────────────────────────
  const ws1 = wb.addWorksheet("Data Responden")

  ws1.mergeCells("A1:X1")
  const t1 = ws1.getCell("A1")
  t1.value = `DATA RESPONDEN SKM ${OFFICE_NAME} TAHUN ${SURVEY_YEAR}`
  t1.font = { bold: true, size: 12, color: { argb: WHITE } }
  t1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } }
  t1.alignment = { horizontal: "center", vertical: "middle" }
  ws1.getRow(1).height = 30

  const headers = [
    "No", "Tanggal", "Nama", "Nomor HP", "Email",
    "Unit Layanan", "Keperluan",
    "Usia/Kelompok", "Jenis Kelamin", "Pendidikan", "Pekerjaan", "Disabilitas",
    ...IKM_UNSUR_LABELS.map((u) => `${u.key}: ${u.label}`),
    "IKM", "Kritik & Saran",
  ]

  const headerRow = ws1.addRow(headers)
  headerRow.eachCell(headerStyle)
  ws1.getRow(2).height = 36

  responses.forEach((r, idx) => {
    const unsurScores = getResponseUnsurScores(r)
    const validScores = unsurScores.filter((s): s is number => s != null)
    const ikmAvg = validScores.length > 0
      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length) * 25
      : null
    const ageDisplay = r.ageGroup ?? (r.age != null ? String(r.age) : "")
    const disabilitasDisplay = r.isDisabilitas == null
      ? ""
      : r.isDisabilitas
        ? `Ya${r.jenisDisabilitas ? ` (${r.jenisDisabilitas})` : ""}`
        : "Tidak"

    const row = ws1.addRow([
      idx + 1,
      r.createdAt.toLocaleDateString("id-ID"),
      r.nama ?? "", r.phone, r.email,
      r.unitLayanan, r.keperluan ?? "",
      ageDisplay, r.gender, r.education,
      r.pekerjaan ?? "", disabilitasDisplay,
      ...unsurScores.map((s) => s != null ? Math.round(s * 100) / 100 : ""),
      ikmAvg != null ? Math.round(ikmAvg * 100) / 100 : "",
      r.q10a ?? "",
    ])

    // Color-code unsur score columns (cols M–U = 13–21)
    for (let col = 13; col <= 21; col++) {
      const cell = row.getCell(col)
      const val = cell.value as number | string
      cell.alignment = { horizontal: "center" }
      if (typeof val === "number") {
        cell.fill = {
          type: "pattern", pattern: "solid",
          fgColor: { argb: val <= 2 ? RED_LIGHT : GREEN_LIGHT },
        }
      } else {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GRAY_LIGHT } }
      }
    }
  })

  // Column widths
  // 1:No 2:Tanggal 3:Nama 4:Nomor HP 5:Email 6:Unit Layanan 7:Keperluan
  // 8:Usia 9:Gender 10:Pendidikan 11:Pekerjaan 12:Disabilitas
  // 13–21:Unsur 22:IKM 23:Kritik & Saran
  ws1.getColumn(1).width = 5
  ws1.getColumn(2).width = 14
  ws1.getColumn(3).width = 24
  ws1.getColumn(4).width = 16
  ws1.getColumn(5).width = 24
  ws1.getColumn(6).width = 32
  ws1.getColumn(7).width = 28
  ws1.getColumn(8).width = 14
  ws1.getColumn(9).width = 12
  ws1.getColumn(10).width = 16
  ws1.getColumn(11).width = 18
  ws1.getColumn(12).width = 14
  for (let i = 13; i <= 21; i++) ws1.getColumn(i).width = 10
  ws1.getColumn(22).width = 8
  ws1.getColumn(23).width = 40

  ws1.autoFilter = { from: "A2", to: "W2" }
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

  ws2.addRow(["No", "Unsur Pelayanan", "Jumlah Nilai", "NRR per Unsur", "IKM per Unsur", "Kategori", "Keterangan"])
  ws2.getRow(2).eachCell(headerStyle)

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
      row.eachCell((cell) => { cell.border = cellBorder })
    })

    ws2.addRow([])
    const totalRow = ws2.addRow(["", "IKM UNIT LAYANAN", "", "", ikm.ikmUnit, ikm.category.label, ikm.category.name])
    totalRow.font = { bold: true }
    totalRow.getCell(5).numFmt = "0.00"
    totalRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2EFDA" } }
    })

    ws2.addRow([])
    ws2.addRow(["Jumlah Responden:", ikm.n])
    ws2.addRow(["Tanggal Cetak:", new Date().toLocaleDateString("id-ID")])
  }

  ws2.getColumn(1).width = 5
  ws2.getColumn(2).width = 36
  ws2.getColumn(3).width = 14
  ws2.getColumn(4).width = 14
  ws2.getColumn(5).width = 14
  ws2.getColumn(6).width = 10
  ws2.getColumn(7).width = 16

  // ── Sheet 3: Demografi ────────────────────────────────────────────────────
  const ws3 = wb.addWorksheet("Demografi")

  ws3.mergeCells("A1:C1")
  const t3 = ws3.getCell("A1")
  t3.value = `PROFIL DEMOGRAFI RESPONDEN — ${OFFICE_NAME} TAHUN ${SURVEY_YEAR}`
  t3.font = { bold: true, size: 11, color: { argb: WHITE } }
  t3.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } }
  t3.alignment = { horizontal: "center", vertical: "middle" }
  ws3.getRow(1).height = 28

  let row = 3

  function addDemoSection(title: string, counts: Record<string, number>) {
    const entries = Object.entries(counts).filter(([, v]) => v > 0)
    if (entries.length === 0) return
    const total = entries.reduce((a, [, v]) => a + v, 0)
    ws3.getCell(`A${row}`).value = title
    ws3.getCell(`A${row}`).font = { bold: true }
    ws3.getCell(`B${row}`).value = "Jumlah"
    ws3.getCell(`C${row}`).value = "Persentase"
    ws3.getRow(row).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } }
      cell.font = { bold: true, color: { argb: WHITE } }
      cell.border = cellBorder
    })
    row++
    for (const [name, count] of entries) {
      ws3.getCell(`A${row}`).value = name
      ws3.getCell(`B${row}`).value = count
      ws3.getCell(`C${row}`).value = `${((count / total) * 100).toFixed(1)}%`
      ws3.getRow(row).eachCell((cell) => { cell.border = cellBorder })
      row++
    }
    row++
  }

  // Need demographics computed here
  const { gender, education, ageGroup, unitLayanan, pekerjaan, disabilitas } =
    (() => {
      const g: Record<string, number> = {}
      const ed: Record<string, number> = {}
      const ag: Record<string, number> = {}
      const ul: Record<string, number> = {}
      const pk: Record<string, number> = {}
      const dis: Record<string, number> = {}
      for (const r of responses) {
        g[r.gender] = (g[r.gender] ?? 0) + 1
        ed[r.education] = (ed[r.education] ?? 0) + 1
        const grp = r.ageGroup ?? String(r.age ?? "")
        ag[grp] = (ag[grp] ?? 0) + 1
        ul[r.unitLayanan] = (ul[r.unitLayanan] ?? 0) + 1
        if (r.pekerjaan) pk[r.pekerjaan] = (pk[r.pekerjaan] ?? 0) + 1
        if (r.isDisabilitas != null) {
          const key = r.isDisabilitas ? "Disabilitas" : "Non-Disabilitas"
          dis[key] = (dis[key] ?? 0) + 1
        }
      }
      return { gender: g, education: ed, ageGroup: ag, unitLayanan: ul, pekerjaan: pk, disabilitas: dis }
    })()

  addDemoSection("Jenis Kelamin", gender)
  addDemoSection("Kelompok Usia", ageGroup)
  addDemoSection("Pendidikan", education)
  addDemoSection("Pekerjaan", pekerjaan)
  addDemoSection("Status Disabilitas", disabilitas)
  addDemoSection("Unit Layanan", unitLayanan)

  ws3.getColumn(1).width = 32
  ws3.getColumn(2).width = 12
  ws3.getColumn(3).width = 14

  return await wb.xlsx.writeBuffer()
}
