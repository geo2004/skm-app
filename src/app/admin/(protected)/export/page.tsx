import { prisma } from "@/lib/prisma"
import { computeIKM } from "@/lib/ikm"
import { SURVEY_YEAR } from "@/lib/constants"
import ExportButtons from "@/components/export/ExportButtons"

export const dynamic = "force-dynamic"

export default async function ExportPage() {
  const count = await prisma.response.count()
  const responses = count > 0 ? await prisma.response.findMany() : []
  const ikm = computeIKM(responses)

  return (
    <div className="p-5 pb-24 md:pb-8 max-w-2xl">
      <h1 className="text-xl font-bold mb-1" style={{ color: "#113F51", fontFamily: "Poppins, sans-serif" }}>Ekspor Laporan</h1>
      <p className="text-sm text-gray-500 mb-6">Tahun {SURVEY_YEAR} — {count} responden</p>

      {count === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
          <p className="text-3xl mb-2">📭</p>
          <p>Belum ada data untuk diekspor</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          {ikm && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-3">Ringkasan</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: "#1A3A6B" }}>{count}</p>
                  <p className="text-xs text-gray-500">Responden</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: ikm.category.color }}>{ikm.ikmUnit.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">IKM Unit</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: ikm.category.color }}>{ikm.category.label}</p>
                  <p className="text-xs text-gray-500">{ikm.category.name}</p>
                </div>
              </div>
            </div>
          )}

          <ExportButtons year={SURVEY_YEAR} />
        </div>
      )}
    </div>
  )
}
