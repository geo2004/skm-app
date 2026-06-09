import { prisma } from "@/lib/prisma"
import { computeIKM, computeDemographics } from "@/lib/ikm"
import { IKM_UNSUR_LABELS, SURVEY_YEAR, OFFICE_NAME } from "@/lib/constants"
import DashboardCharts from "@/components/dashboard/DashboardCharts"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const responses = await prisma.response.findMany()
  const ikm = computeIKM(responses)
  const demo = computeDemographics(responses)

  return (
    <div className="p-5 pb-24 md:pb-8 max-w-5xl">
      <div className="mb-5 pb-3" style={{ borderBottom: "2px solid #D5C58A" }}>
        <h1 className="text-xl font-bold" style={{ color: "#113F51", fontFamily: "Poppins, sans-serif" }}>
          Dashboard SKM
        </h1>
        <p className="text-sm text-gray-500">{OFFICE_NAME} — Tahun {SURVEY_YEAR}</p>
      </div>

      {/* IKM Banner */}
      {ikm ? (
        <div className="rounded-xl p-6 text-white mb-6 shadow-sm overflow-hidden relative"
          style={{ background: ikm.category.color }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "#D5C58A" }} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">IKM Unit Layanan</p>
              <p className="text-5xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
                {ikm.ikmUnit.toFixed(2)}
              </p>
              <p className="text-white/60 text-xs mt-1">dari skala 100</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-black opacity-20">{ikm.category.label}</div>
              <p className="text-white font-semibold text-lg -mt-4">{ikm.category.name}</p>
              <p className="text-white/60 text-sm">{ikm.n} responden</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white border-2 border-dashed p-10 text-center text-gray-400 mb-6"
          style={{ borderColor: "#D5C58A" }}>
          <p className="text-4xl mb-2">📭</p>
          <p>Belum ada data survei</p>
        </div>
      )}

      {/* Unsur Cards */}
      {ikm && (
        <>
          <h2 className="font-semibold text-gray-600 mb-3 text-xs uppercase tracking-widest">
            IKM per Unsur Pelayanan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {ikm.unsur.map((u) => (
              <div key={u.key} className="bg-white rounded-xl p-4 shadow-sm"
                style={{ borderLeft: "3px solid " + u.category.color }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: "#0E5B73" }}>
                    {u.key}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: u.category.color }}>
                    {u.category.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{u.label}</p>
                <p className="text-2xl font-bold" style={{ color: u.category.color, fontFamily: "Poppins, sans-serif" }}>
                  {u.ikm.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">NRR: {u.nrr.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {ikm && (
        <DashboardCharts
          unsurData={ikm.unsur.map((u) => ({ name: u.key, label: u.label, ikm: u.ikm, color: u.category.color }))}
          genderData={Object.entries(demo.gender).map(([name, value]) => ({ name, value }))}
          educationData={Object.entries(demo.education).map(([name, value]) => ({ name, value }))}
          ageData={Object.entries(demo.ageGroup).map(([name, value]) => ({ name, value }))}
          pekerjaanData={Object.entries(demo.pekerjaan).map(([name, value]) => ({ name, value }))}
          disabilitasData={Object.entries(demo.disabilitas).map(([name, value]) => ({ name, value }))}
        />
      )}
    </div>
  )
}
