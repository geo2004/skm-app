import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const ALLOWED_GENDERS = ["Laki-laki", "Perempuan"]
const ALLOWED_EDUCATIONS = [
  "SD atau sederajat",
  "SMP atau sederajat",
  "SMA atau sederajat",
  "Diploma (D3)",
  "Sarjana (S1)",
  "Magister (S2)",
  "Doktor (S3)",
]

function isValidScore(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 4
}

// POST /api/responses — public, submit survey
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { phone, email, age, gender, education, unitLayanan,
          q1, q2, q3, q4, q5, q6, q7, q8, q9, q10a, q10b, specificData } = body

  // Validate required fields
  if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
    return NextResponse.json({ error: "Nomor HP tidak valid" }, { status: 400 })
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 })
  }
  const ageNum = Number(age)
  if (!Number.isInteger(ageNum) || ageNum < 15 || ageNum > 100) {
    return NextResponse.json({ error: "Usia tidak valid" }, { status: 400 })
  }
  if (!ALLOWED_GENDERS.includes(gender)) {
    return NextResponse.json({ error: "Jenis kelamin tidak valid" }, { status: 400 })
  }
  if (!ALLOWED_EDUCATIONS.includes(education)) {
    return NextResponse.json({ error: "Pendidikan tidak valid" }, { status: 400 })
  }
  if (!unitLayanan || typeof unitLayanan !== "string") {
    return NextResponse.json({ error: "Unit layanan harus dipilih" }, { status: 400 })
  }
  for (const [key, val] of Object.entries({ q1, q2, q3, q4, q5, q6, q7, q8, q9 })) {
    if (!isValidScore(val)) {
      return NextResponse.json(
        { error: `Jawaban ${key.toUpperCase()} harus antara 1-4` },
        { status: 400 }
      )
    }
  }

  // Duplicate check: same phone in current year
  const yearStart = new Date(new Date().getFullYear(), 0, 1)
  const existing = await prisma.response.findFirst({
    where: { phone: phone.trim(), createdAt: { gte: yearStart } },
  })
  if (existing) {
    return NextResponse.json(
      { error: "Anda sudah mengisi survei ini. Terima kasih atas partisipasi Anda." },
      { status: 409 }
    )
  }

  const response = await prisma.response.create({
    data: {
      phone: phone.trim(),
      email: email.trim(),
      age: ageNum,
      gender,
      education,
      unitLayanan,
      q1, q2, q3, q4, q5, q6, q7, q8, q9,
      q10a: q10a?.trim() || null,
      q10b: q10b?.trim() || null,
      specificData: specificData && typeof specificData === "object"
        ? JSON.stringify(specificData)
        : null,
    },
  })

  return NextResponse.json({ id: response.id }, { status: 201 })
}

// GET /api/responses — admin only, paginated list
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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

  return NextResponse.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
