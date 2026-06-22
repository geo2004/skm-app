import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  UNIT_LAYANAN_OPTIONS,
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/constants"

// POST /api/tamu — public, register visitor
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { nama, phone, email, age, gender, education, unitLayanan, keperluan } = body

  if (!nama || typeof nama !== "string" || nama.trim().length < 2)
    return NextResponse.json({ error: "Nama tidak valid" }, { status: 400 })
  if (!phone || typeof phone !== "string" || phone.trim().length < 8)
    return NextResponse.json({ error: "Nomor HP tidak valid" }, { status: 400 })
  if (email && (typeof email !== "string" || !email.includes("@")))
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 })
  const ageNum = Number(age)
  if (!Number.isInteger(ageNum) || ageNum < 15 || ageNum > 100)
    return NextResponse.json({ error: "Usia harus antara 15–100 tahun" }, { status: 400 })
  if (!GENDER_OPTIONS.includes(gender))
    return NextResponse.json({ error: "Jenis kelamin tidak valid" }, { status: 400 })
  if (!EDUCATION_OPTIONS.includes(education))
    return NextResponse.json({ error: "Pendidikan tidak valid" }, { status: 400 })
  if (!unitLayanan || !UNIT_LAYANAN_OPTIONS.includes(unitLayanan))
    return NextResponse.json({ error: "Unit layanan tidak valid" }, { status: 400 })

  const record = await prisma.bukuTamu.create({
    data: {
      nama: nama.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      age: ageNum,
      gender,
      education,
      unitLayanan,
      keperluan: keperluan?.trim() || null,
    },
  })

  return NextResponse.json({ id: record.id, nama: record.nama }, { status: 201 })
}

// GET /api/tamu?phone=xxx — lookup today's registration by phone
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get("phone")?.trim()
  if (!phone || phone.length < 8)
    return NextResponse.json({ found: false }, { status: 200 })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const record = await prisma.bukuTamu.findFirst({
    where: { phone, createdAt: { gte: todayStart } },
    orderBy: { createdAt: "desc" },
    select: { id: true, nama: true, email: true, age: true, gender: true, education: true, unitLayanan: true, keperluan: true },
  })

  if (!record) return NextResponse.json({ found: false }, { status: 200 })

  return NextResponse.json({ found: true, ...record })
}
