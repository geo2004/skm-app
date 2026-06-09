// Perhitungan IKM berdasarkan Permenpan-RB No. 14 Tahun 2017
// Kuesioner Hybrid: 19 sub-questions mapped to 9 unsur
// Legacy format: q1-q9 direct mapping

import { IKM_CATEGORIES, IKMCategory, IKM_UNSUR_LABELS, AGE_GROUPS } from "./constants"

export interface ResponseData {
  // Demographics
  gender: string
  education: string
  unitLayanan: string
  age?: number | null          // integer — legacy responses only
  ageGroup?: string | null     // string group — new responses
  pekerjaan?: string | null
  isDisabilitas?: boolean | null
  jenisDisabilitas?: string | null
  // Legacy questions (q1-q9)
  q1?: number | null; q2?: number | null; q3?: number | null
  q4?: number | null; q5?: number | null; q6?: number | null
  q7?: number | null; q8?: number | null; q9?: number | null
  // New questions (nq1-nq16b)
  nq1?: number | null;  nq2?: number | null;  nq3?: number | null
  nq4?: number | null;  nq5?: number | null;  nq6?: number | null
  nq7?: number | null;  nq8?: number | null;  nq9?: number | null
  nq10?: number | null; nq11a?: number | null; nq11b?: number | null
  nq12a?: number | null; nq12b?: number | null; nq13?: number | null
  nq14?: number | null; nq15?: number | null
  nq16a?: number | null; nq16b?: number | null
}

export interface UnsurResult {
  key: string
  label: string
  nrr: number      // average score 1-4
  ikm: number      // NRR × 25 (0-100)
  category: IKMCategory
}

export interface IKMResult {
  n: number
  unsur: UnsurResult[]
  ikmUnit: number
  category: IKMCategory
}

export interface DemographicData {
  gender: Record<string, number>
  education: Record<string, number>
  ageGroup: Record<string, number>
  unitLayanan: Record<string, number>
  pekerjaan: Record<string, number>
  disabilitas: Record<string, number>
}

// Mapping of new hybrid questions to 9 unsur IKM
// For each unsur, derive a single 1-4 score from whichever format the response uses
const UNSUR_DEFS: Array<{
  key: string
  label: string
  getScore: (r: ResponseData) => number | null
}> = [
  {
    key: "U1", label: "Persyaratan",
    getScore: (r) => r.nq1 != null && r.nq2 != null
      ? (r.nq1 + r.nq2) / 2
      : (r.q1 ?? null),
  },
  {
    key: "U2", label: "Prosedur",
    getScore: (r) => r.nq3 != null && r.nq4 != null && r.nq5 != null
      ? (r.nq3 + r.nq4 + r.nq5) / 3
      : (r.q2 ?? null),
  },
  {
    key: "U3", label: "Waktu Penyelesaian",
    getScore: (r) => r.nq6 != null ? r.nq6 : (r.q3 ?? null),
  },
  {
    key: "U4", label: "Biaya/Tarif",
    getScore: (r) => r.nq7 != null && r.nq8 != null && r.nq9 != null
      ? (r.nq7 + r.nq8 + r.nq9) / 3
      : (r.q4 ?? null),
  },
  {
    key: "U5", label: "Produk Layanan",
    getScore: (r) => r.nq10 != null ? r.nq10 : (r.q5 ?? null),
  },
  {
    key: "U6", label: "Kompetensi Pelaksana",
    getScore: (r) => r.nq11a != null && r.nq11b != null
      ? (r.nq11a + r.nq11b) / 2
      : (r.q6 ?? null),
  },
  {
    key: "U7", label: "Perilaku Pelaksana",
    getScore: (r) => r.nq12a != null && r.nq12b != null && r.nq13 != null
      ? (r.nq12a + r.nq12b + r.nq13) / 3
      : (r.q7 ?? null),
  },
  {
    key: "U8", label: "Penanganan Pengaduan",
    getScore: (r) => r.nq14 != null && r.nq15 != null
      ? (r.nq14 + r.nq15) / 2
      : (r.q8 ?? null),
  },
  {
    key: "U9", label: "Sarana dan Prasarana",
    getScore: (r) => r.nq16a != null && r.nq16b != null
      ? (r.nq16a + r.nq16b) / 2
      : (r.q9 ?? null),
  },
]

export function getIKMCategory(score: number): IKMCategory {
  return (
    IKM_CATEGORIES.find((c) => score >= c.min && score <= c.max) ??
    IKM_CATEGORIES[3]
  )
}

// Returns per-unsur 1-4 scores for a single response (null if not answerable)
export function getResponseUnsurScores(r: ResponseData): Array<number | null> {
  return UNSUR_DEFS.map((u) => u.getScore(r))
}

export function computeIKM(responses: ResponseData[]): IKMResult | null {
  // Only include responses that have at least one answerable unsur
  const valid = responses.filter((r) =>
    UNSUR_DEFS.some((u) => u.getScore(r) != null)
  )
  const n = valid.length
  if (n === 0) return null

  const unsur: UnsurResult[] = UNSUR_DEFS.map((def, i) => {
    const label = IKM_UNSUR_LABELS[i].label
    const scores = valid
      .map((r) => def.getScore(r))
      .filter((s): s is number => s != null)
    const nrr = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const ikm = nrr * 25
    return {
      key: def.key,
      label,
      nrr: Math.round(nrr * 100) / 100,
      ikm: Math.round(ikm * 100) / 100,
      category: getIKMCategory(ikm),
    }
  })

  const ikmUnit =
    Math.round((unsur.reduce((acc, u) => acc + u.ikm, 0) / 9) * 100) / 100

  return { n, unsur, ikmUnit, category: getIKMCategory(ikmUnit) }
}

export function getAgeGroup(age: number): string {
  if (age < 17) return "< 17 tahun"
  if (age <= 25) return "17-25 tahun"
  if (age <= 34) return "26-34 tahun"
  if (age <= 44) return "35-44 tahun"
  if (age <= 54) return "45-54 tahun"
  if (age <= 65) return "55-65 tahun"
  return "> 65 tahun"
}

export function computeDemographics(responses: ResponseData[]): DemographicData {
  const gender: Record<string, number> = {}
  const education: Record<string, number> = {}
  const ageGroup: Record<string, number> = {}
  const unitLayanan: Record<string, number> = {}
  const pekerjaan: Record<string, number> = {}
  const disabilitas: Record<string, number> = {}

  // Pre-initialize age groups in order
  AGE_GROUPS.forEach((g) => (ageGroup[g] = 0))

  for (const r of responses) {
    gender[r.gender] = (gender[r.gender] ?? 0) + 1
    education[r.education] = (education[r.education] ?? 0) + 1
    unitLayanan[r.unitLayanan] = (unitLayanan[r.unitLayanan] ?? 0) + 1

    // Age group: use stored string for new responses, derive from integer for legacy
    const group = r.ageGroup ?? getAgeGroup(r.age ?? 0)
    ageGroup[group] = (ageGroup[group] ?? 0) + 1

    // Pekerjaan (new responses only)
    if (r.pekerjaan) {
      pekerjaan[r.pekerjaan] = (pekerjaan[r.pekerjaan] ?? 0) + 1
    }

    // Disabilitas (new responses only)
    if (r.isDisabilitas != null) {
      const key = r.isDisabilitas ? "Disabilitas" : "Non-Disabilitas"
      disabilitas[key] = (disabilitas[key] ?? 0) + 1
    }
  }

  return { gender, education, ageGroup, unitLayanan, pekerjaan, disabilitas }
}
