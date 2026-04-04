// Perhitungan IKM berdasarkan Permenpan-RB No. 14 Tahun 2017
// IKM per unsur = NRR × 25 (NRR = rata-rata nilai 1-4)
// IKM Unit Layanan = rata-rata dari 9 IKM unsur

import { IKM_CATEGORIES, IKMCategory, SURVEY_QUESTIONS, AGE_GROUPS } from "./constants"

export interface ResponseData {
  q1: number
  q2: number
  q3: number
  q4: number
  q5: number
  q6: number
  q7: number
  q8: number
  q9: number
  gender: string
  education: string
  age: number
  unitLayanan: string
}

export interface UnsurResult {
  key: string
  label: string
  nrr: number       // Rata-rata 1-4
  ikm: number       // NRR × 25 (0-100)
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
}

const Q_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"] as const

export function getIKMCategory(score: number): IKMCategory {
  return (
    IKM_CATEGORIES.find((c) => score >= c.min && score <= c.max) ??
    IKM_CATEGORIES[3]
  )
}

export function computeIKM(responses: ResponseData[]): IKMResult | null {
  const n = responses.length
  if (n === 0) return null

  const unsur: UnsurResult[] = SURVEY_QUESTIONS.map((q, i) => {
    const key = Q_KEYS[i]
    const sum = responses.reduce((acc, r) => acc + r[key], 0)
    const nrr = sum / n
    const ikm = nrr * 25
    return {
      key: q.key,
      label: q.label,
      nrr: Math.round(nrr * 100) / 100,
      ikm: Math.round(ikm * 100) / 100,
      category: getIKMCategory(ikm),
    }
  })

  const ikmUnit =
    Math.round((unsur.reduce((acc, u) => acc + u.ikm, 0) / 9) * 100) / 100

  return {
    n,
    unsur,
    ikmUnit,
    category: getIKMCategory(ikmUnit),
  }
}

export function getAgeGroup(age: number): string {
  if (age < 20) return "< 20"
  if (age <= 30) return "20 - 30"
  if (age <= 40) return "31 - 40"
  if (age <= 50) return "41 - 50"
  if (age <= 60) return "51 - 60"
  return "> 60"
}

export function computeDemographics(responses: ResponseData[]): DemographicData {
  const gender: Record<string, number> = {}
  const education: Record<string, number> = {}
  const ageGroup: Record<string, number> = {}
  const unitLayanan: Record<string, number> = {}

  // Pre-initialize age groups in order
  AGE_GROUPS.forEach((g) => (ageGroup[g] = 0))

  for (const r of responses) {
    gender[r.gender] = (gender[r.gender] ?? 0) + 1
    education[r.education] = (education[r.education] ?? 0) + 1
    unitLayanan[r.unitLayanan] = (unitLayanan[r.unitLayanan] ?? 0) + 1
    const group = getAgeGroup(r.age)
    ageGroup[group] = (ageGroup[group] ?? 0) + 1
  }

  return { gender, education, ageGroup, unitLayanan }
}
