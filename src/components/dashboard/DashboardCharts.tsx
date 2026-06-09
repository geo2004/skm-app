"use client"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"

interface UnsurItem { name: string; label: string; ikm: number; color: string }
interface LabelValue { name: string; value: number }

interface Props {
  unsurData: UnsurItem[]
  genderData: LabelValue[]
  educationData: LabelValue[]
  ageData: LabelValue[]
  pekerjaanData: LabelValue[]
  disabilitasData: LabelValue[]
}

const PIE_COLORS = ["#113F51", "#D5C58A", "#0E5B73", "#16a34a", "#dc2626", "#7c3aed", "#ea580c", "#0891b2"]

function SmallPie({ data, title }: { data: LabelValue[]; title: string }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  if (total === 0) return (
    <div className="bg-white rounded-xl shadow-sm p-5" style={{ borderLeft: "3px solid #D5C58A" }}>
      <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide" style={{ color: "#113F51" }}>{title}</h3>
      <p className="text-sm text-gray-400 text-center py-8">Belum ada data</p>
    </div>
  )
  return (
    <div className="bg-white rounded-xl shadow-sm p-5" style={{ borderLeft: "3px solid #D5C58A" }}>
      <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide" style={{ color: "#113F51" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
            {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function SmallBar({ data, title, color }: { data: LabelValue[]; title: string; color: string }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  if (total === 0) return (
    <div className="bg-white rounded-xl shadow-sm p-5" style={{ borderLeft: "3px solid #D5C58A" }}>
      <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide" style={{ color: "#113F51" }}>{title}</h3>
      <p className="text-sm text-gray-400 text-center py-8">Belum ada data</p>
    </div>
  )
  return (
    <div className="bg-white rounded-xl shadow-sm p-5" style={{ borderLeft: "3px solid #D5C58A" }}>
      <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide" style={{ color: "#113F51" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={Math.max(140, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10 }}>
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80}
            tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + "…" : v} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function DashboardCharts({
  unsurData, genderData, educationData, ageData, pekerjaanData, disabilitasData,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Bar chart: IKM per Unsur */}
      <div className="bg-white rounded-xl shadow-sm p-5" style={{ borderLeft: "3px solid #D5C58A" }}>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "#113F51" }}>
          Grafik IKM per Unsur Pelayanan
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={unsurData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(val, _name, props) => [
                `${Number(val).toFixed(2)}`,
                (props as { payload?: { label?: string } })?.payload?.label ?? "",
              ]}
            />
            <Bar dataKey="ikm" radius={[6, 6, 0, 0]}>
              {unsurData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex flex-wrap gap-2">
          {unsurData.map((u) => (
            <span key={u.name} className="text-xs text-gray-500">
              <span className="font-semibold">{u.name}</span>: {u.label}
            </span>
          ))}
        </div>
      </div>

      {/* Row 1: Gender + Usia + Disabilitas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SmallPie data={genderData} title="Jenis Kelamin" />
        <SmallBar data={ageData} title="Kelompok Usia" color="#113F51" />
        <SmallPie data={disabilitasData} title="Status Disabilitas" />
      </div>

      {/* Row 2: Pendidikan + Pekerjaan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SmallBar data={educationData} title="Pendidikan" color="#D5C58A" />
        <SmallBar data={pekerjaanData} title="Pekerjaan" color="#0E5B73" />
      </div>
    </div>
  )
}
