import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AGE_GROUPS, EDUCATION_OPTIONS, PEKERJAAN_OPTIONS } from "@/lib/constants"

const ALLOWED_GENDERS = ["Laki-laki", "Perempuan"]

function isValidScore(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 4
}

const NEW_Q_KEYS = [
  "nq1","nq2","nq3","nq4","nq5","nq6","nq7","nq8","nq9","nq10",
  "nq11a","nq11b","nq12a","nq12b","nq13","nq14","nq15","nq16a","nq16b",
] as const

// POST /api/responses — public, submit survey (new hybrid format)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const {
    phone, email, ageGroup, gender, education, unitLayanan,
    pekerjaan, isDisabilitas, jenisDisabilitas,
    q10a, specificData, bukuTamuId,
  } = body

  // --- Validate demographics ---
  if (!phone || typeof phone !== "string" || phone.trim().length < 8)
    return NextResponse.json({ error: "Nomor HP tidak valid" }, { status: 400 })
  if (!email || typeof email !== "string" || !email.includes("@"))
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 })
  if (!ageGroup || !AGE_GROUPS.includes(ageGroup))
    return NextResponse.json({ error: "Kelompok usia tidak valid" }, { status: 400 })
  if (!ALLOWED_GENDERS.includes(gender))
    return NextResponse.json({ error: "Jenis kelamin tidak valid" }, { status: 400 })
  if (!EDUCATION_OPTIONS.includes(education))
    return NextResponse.json({ error: "Pendidikan tidak valid" }, { status: 400 })
  if (!unitLayanan || typeof unitLayanan !== "string")
    return NextResponse.json({ error: "Unit layanan harus dipilih" }, { status: 400 })
  if (!pekerjaan || typeof pekerjaan !== "string" || pekerjaan.trim().length < 2)
    return NextResponse.json({ error: "Pekerjaan tidak valid" }, { status: 400 })
  if (typeof isDisabilitas !== "boolean")
    return NextResponse.json({ error: "Status disabilitas tidak valid" }, { status: 400 })

  // --- Validate new questions ---
  for (const key of NEW_Q_KEYS) {
    if (!isValidScore(body[key]))
      return NextResponse.json({ error: `Jawaban ${key} harus antara 1-4` }, { status: 400 })
  }

  // --- Duplicate check: same phone in current year ---
  const yearStart = new Date(new Date().getFullYear(), 0, 1)
  const existing = await prisma.response.findFirst({
    where: { phone: phone.trim(), createdAt: { gte: yearStart } },
  })
  if (existing)
    return NextResponse.json(
      { error: "Anda sudah mengisi survei ini. Terima kasih atas partisipasi Anda." },
      { status: 409 }
    )

  const response = await prisma.response.create({
    data: {
      phone: phone.trim(),
      email: email.trim(),
      ageGroup,
      gender,
      education,
      unitLayanan,
      pekerjaan: pekerjaan.trim(),
      isDisabilitas,
      jenisDisabilitas: isDisabilitas && jenisDisabilitas ? String(jenisDisabilitas) : null,
      // New questions
      nq1: body.nq1, nq2: body.nq2, nq3: body.nq3, nq4: body.nq4, nq5: body.nq5,
      nq6: body.nq6, nq7: body.nq7, nq8: body.nq8, nq9: body.nq9, nq10: body.nq10,
      nq11a: body.nq11a, nq11b: body.nq11b,
      nq12a: body.nq12a, nq12b: body.nq12b,
      nq13: body.nq13, nq14: body.nq14, nq15: body.nq15,
      nq16a: body.nq16a, nq16b: body.nq16b,
      // Open-ended (single field in new format)
      q10a: typeof q10a === "string" && q10a.trim() ? q10a.trim() : null,
      // Specific data for housing programs
      specificData: specificData && typeof specificData === "object"
        ? JSON.stringify(specificData)
        : null,
      bukuTamuId: typeof bukuTamuId === "number" ? bukuTamuId : null,
    },
  })

  return NextResponse.json({ id: response.id }, { status: 201 })
}

// GET /api/responses — admin only, paginated list
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"))
  const search = searchParams.get("search") ?? ""

  const where = search
    ? {
        OR: [
          { phone: { contains: search } },
          { email: { contains: search } },
          { unitLayanan: { contains: search } },
        ],
      }
    : {}

  const [total, data] = await Promise.all([
    prisma.response.count({ where }),
    prisma.response.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) })
}
