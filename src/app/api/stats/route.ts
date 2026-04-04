import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { computeIKM, computeDemographics } from "@/lib/ikm"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const responses = await prisma.response.findMany()

  const ikm = computeIKM(responses)
  const demographics = computeDemographics(responses)

  const dateRange =
    responses.length > 0
      ? {
          earliest: responses.reduce((a, b) =>
            a.createdAt < b.createdAt ? a : b
          ).createdAt,
          latest: responses.reduce((a, b) =>
            a.createdAt > b.createdAt ? a : b
          ).createdAt,
        }
      : null

  return NextResponse.json({ ikm, demographics, dateRange, total: responses.length })
}
