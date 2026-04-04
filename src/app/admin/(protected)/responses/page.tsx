import { prisma } from "@/lib/prisma"
import { SURVEY_QUESTIONS } from "@/lib/constants"
import ResponsesTable from "@/components/responses/ResponsesTable"

export const dynamic = "force-dynamic"

export default async function ResponsesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? "1"))
  const search = params.search ?? ""
  const limit = 20

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

  return (
    <div className="p-5 pb-24 md:pb-8">
      <h1 className="text-xl font-bold mb-1" style={{ color: "#1A3A6B" }}>Data Responden</h1>
      <p className="text-sm text-gray-500 mb-5">Total: {total} responden</p>

      <ResponsesTable
        data={data.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
        total={total}
        page={page}
        totalPages={Math.ceil(total / limit)}
        search={search}
        questions={SURVEY_QUESTIONS}
      />
    </div>
  )
}
