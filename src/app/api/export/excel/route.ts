import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { buildExcelWorkbook } from "@/lib/exportExcel"
import { OFFICE_NAME, SURVEY_YEAR } from "@/lib/constants"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const responses = await prisma.response.findMany({ orderBy: { createdAt: "asc" } })
  const buffer = await buildExcelWorkbook(responses)

  const filename = `SKM_${OFFICE_NAME.replace(/\s/g, "_")}_${SURVEY_YEAR}.xlsx`
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
