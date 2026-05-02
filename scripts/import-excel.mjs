/**
 * Import backup Excel data into Supabase PostgreSQL.
 *
 * Usage:
 *   1. Set DIRECT_URL in .env to the Supabase direct connection string
 *   2. node scripts/import-excel.mjs <path-to-backup.xlsx>
 *
 * Example:
 *   node scripts/import-excel.mjs scripts/backup.xlsx
 */

import ExcelJS from "exceljs"
import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import path from "path"

const filePath = process.argv[2]
if (!filePath) {
  console.error("Usage: node scripts/import-excel.mjs <path-to-backup.xlsx>")
  process.exit(1)
}

const prisma = new PrismaClient()

function parseDate(value) {
  if (value instanceof Date) return value
  if (typeof value === "string" && value.trim()) {
    // id-ID locale format: D/M/YYYY
    const parts = value.trim().split("/")
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number)
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day)
      }
    }
  }
  return new Date()
}

function toInt(value) {
  const n = parseInt(value, 10)
  return isNaN(n) ? null : n
}

async function main() {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(path.resolve(filePath))

  const ws = wb.getWorksheet("Data Responden")
  if (!ws) {
    console.error('Sheet "Data Responden" not found in the Excel file.')
    process.exit(1)
  }

  const rows = []
  ws.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return // skip title + header rows
    const vals = row.values // 1-indexed

    const phone = String(vals[3] ?? "").trim()
    const email = String(vals[4] ?? "").trim()
    const age = toInt(vals[5])
    const gender = String(vals[6] ?? "").trim()
    const education = String(vals[7] ?? "").trim()
    const unitLayanan = String(vals[8] ?? "").trim()
    const q1 = toInt(vals[9])
    const q2 = toInt(vals[10])
    const q3 = toInt(vals[11])
    const q4 = toInt(vals[12])
    const q5 = toInt(vals[13])
    const q6 = toInt(vals[14])
    const q7 = toInt(vals[15])
    const q8 = toInt(vals[16])
    const q9 = toInt(vals[17])
    const q10a = String(vals[18] ?? "").trim() || null
    const q10b = String(vals[19] ?? "").trim() || null
    const createdAt = parseDate(vals[2])

    if (!phone || !email || !unitLayanan || q1 === null) return // skip blank rows

    rows.push({ createdAt, phone, email, age, gender, education, unitLayanan, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10a, q10b })
  })

  console.log(`Found ${rows.length} rows to import...`)

  let imported = 0
  let skipped = 0

  for (const row of rows) {
    // Skip if this phone already exists for the same year (same duplicate rule as the app)
    const year = row.createdAt.getFullYear()
    const existing = await prisma.response.findFirst({
      where: {
        phone: row.phone,
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    })

    if (existing) {
      console.log(`  Skipped duplicate: ${row.phone} (${year})`)
      skipped++
      continue
    }

    await prisma.response.create({ data: row })
    imported++
  }

  console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
