// Konstanta untuk SKM BP3KP Jawa III
// Berdasarkan Permenpan-RB No. 14 Tahun 2017

export const OFFICE_NAME = "BP3KP Jawa III"
export const OFFICE_FULL_NAME =
  "Balai Pelaksana Penyediaan Perumahan dan Kawasan Permukiman Jawa III"
export const MINISTRY = "Kementerian Perumahan dan Kawasan Permukiman"
export const SURVEY_YEAR = process.env.SURVEY_YEAR ?? "2026"

export const UNIT_LAYANAN_OPTIONS = [
  "Klinik PKP BP3KP Jawa IIi",
  "Layanan Informasi Perumahan dan Kawasan Permukiman",
  "Konsultasi Teknis Perumahan dan Kawasan Permukiman",
  "Bantuan Stimulan Perumahan Swadaya (BSPS)",
  "Bantuan Prasarana, Sarana, dan Utilitas (PSU)",
  "Bantuan Rumah Susun (Rusun)",
  "Bantuan Penanganan Kawasan Kumuh",
]

// Daftar program bantuan perumahan (memerlukan pertanyaan tambahan)
export const HOUSING_PROGRAM_KEYS = [
  "Bantuan Stimulan Perumahan Swadaya (BSPS)",
  "Bantuan Prasarana, Sarana, dan Utilitas (PSU)",
  "Bantuan Rumah Susun (Rusun)",
  "Bantuan Penanganan Kawasan Kumuh",
] as const

export const EDUCATION_OPTIONS = [
  "SD atau sederajat",
  "SMP atau sederajat",
  "SMA atau sederajat",
  "Diploma (D3)",
  "Sarjana (S1)",
  "Magister (S2)",
  "Doktor (S3)",
]

export const GENDER_OPTIONS = ["Laki-laki", "Perempuan"]

export const AGE_GROUPS = [
  "< 20",
  "20 - 30",
  "31 - 40",
  "41 - 50",
  "51 - 60",
  "> 60",
]

export interface SurveyOption {
  value: number
  label: string
}

export interface SurveyQuestion {
  id: string
  key: string
  label: string
  text: string
  options: SurveyOption[]
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "q1",
    key: "U1",
    label: "Persyaratan",
    text: "Bagaimana pendapat Saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?",
    options: [
      { value: 1, label: "Tidak sesuai" },
      { value: 2, label: "Kurang sesuai" },
      { value: 3, label: "Sesuai" },
      { value: 4, label: "Sangat sesuai" },
    ],
  },
  {
    id: "q2",
    key: "U2",
    label: "Prosedur",
    text: "Bagaimana pemahaman Saudara tentang kemudahan prosedur pelayanan di unit ini?",
    options: [
      { value: 1, label: "Tidak mudah" },
      { value: 2, label: "Kurang mudah" },
      { value: 3, label: "Mudah" },
      { value: 4, label: "Sangat mudah" },
    ],
  },
  {
    id: "q3",
    key: "U3",
    label: "Waktu Penyelesaian",
    text: "Bagaimana pendapat Saudara tentang kecepatan waktu dalam memberikan pelayanan?",
    options: [
      { value: 1, label: "Tidak cepat" },
      { value: 2, label: "Kurang cepat" },
      { value: 3, label: "Cepat" },
      { value: 4, label: "Sangat cepat" },
    ],
  },
  {
    id: "q4",
    key: "U4",
    label: "Biaya / Tarif",
    text: "Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan?",
    options: [
      { value: 1, label: "Sangat mahal" },
      { value: 2, label: "Cukup mahal" },
      { value: 3, label: "Murah" },
      { value: 4, label: "Gratis / Sangat murah" },
    ],
  },
  {
    id: "q5",
    key: "U5",
    label: "Produk Spesifikasi Layanan",
    text: "Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?",
    options: [
      { value: 1, label: "Tidak sesuai" },
      { value: 2, label: "Kurang sesuai" },
      { value: 3, label: "Sesuai" },
      { value: 4, label: "Sangat sesuai" },
    ],
  },
  {
    id: "q6",
    key: "U6",
    label: "Kompetensi Pelaksana",
    text: "Bagaimana pendapat Saudara tentang kompetensi/kemampuan petugas dalam pelayanan?",
    options: [
      { value: 1, label: "Tidak kompeten" },
      { value: 2, label: "Kurang kompeten" },
      { value: 3, label: "Kompeten" },
      { value: 4, label: "Sangat kompeten" },
    ],
  },
  {
    id: "q7",
    key: "U7",
    label: "Perilaku Pelaksana",
    text: "Bagaimana pendapat Saudara tentang perilaku petugas dalam pelayanan terkait kesopanan dan keramahan?",
    options: [
      { value: 1, label: "Tidak sopan" },
      { value: 2, label: "Kurang sopan" },
      { value: 3, label: "Sopan" },
      { value: 4, label: "Sangat sopan" },
    ],
  },
  {
    id: "q8",
    key: "U8",
    label: "Penanganan Pengaduan",
    text: "Bagaimana pendapat Saudara tentang penanganan pengaduan pengguna layanan?",
    options: [
      { value: 1, label: "Tidak ada" },
      { value: 2, label: "Ada tetapi tidak berfungsi" },
      { value: 3, label: "Berfungsi kurang maksimal" },
      { value: 4, label: "Dikelola dengan baik" },
    ],
  },
  {
    id: "q9",
    key: "U9",
    label: "Sarana dan Prasarana",
    text: "Bagaimana pendapat Saudara tentang kualitas sarana dan prasarana?",
    options: [
      { value: 1, label: "Buruk" },
      { value: 2, label: "Kurang baik" },
      { value: 3, label: "Baik" },
      { value: 4, label: "Sangat baik" },
    ],
  },
]

export interface IKMCategory {
  label: string
  name: string
  min: number
  max: number
  color: string
  bgClass: string
  textClass: string
}

// Pertanyaan khusus per program bantuan perumahan (Seksi B kuesioner)
export const PROGRAM_SPECIFIC_QUESTIONS: Record<string, SurveyQuestion[]> = {
  "Bantuan Stimulan Perumahan Swadaya (BSPS)": [
    {
      id: "s1", key: "B1", label: "Kualitas Material",
      text: "Bagaimana pendapat Anda tentang kualitas material bangunan yang diberikan?",
      options: [
        { value: 1, label: "Sangat buruk" },
        { value: 2, label: "Kurang baik" },
        { value: 3, label: "Baik" },
        { value: 4, label: "Sangat baik" },
      ],
    },
    {
      id: "s2", key: "B2", label: "Ketepatan Jumlah & Waktu",
      text: "Bagaimana ketepatan jumlah dan waktu penyaluran bantuan?",
      options: [
        { value: 1, label: "Sangat tidak tepat" },
        { value: 2, label: "Kurang tepat" },
        { value: 3, label: "Tepat" },
        { value: 4, label: "Sangat tepat" },
      ],
    },
    {
      id: "s3", key: "B3", label: "Pendampingan TFL",
      text: "Bagaimana kualitas pendampingan Tenaga Fasilitator Lapangan (TFL)?",
      options: [
        { value: 1, label: "Tidak ada" },
        { value: 2, label: "Kurang memadai" },
        { value: 3, label: "Memadai" },
        { value: 4, label: "Sangat memadai" },
      ],
    },
    {
      id: "s4", key: "B4", label: "Dampak Bantuan",
      text: "Bagaimana dampak bantuan terhadap kondisi rumah Anda?",
      options: [
        { value: 1, label: "Tidak berdampak" },
        { value: 2, label: "Sedikit berdampak" },
        { value: 3, label: "Berdampak" },
        { value: 4, label: "Sangat berdampak" },
      ],
    },
  ],
  "Bantuan Prasarana, Sarana, dan Utilitas (PSU)": [
    {
      id: "s1", key: "B1", label: "Kualitas Fisik PSU",
      text: "Bagaimana kualitas fisik prasarana, sarana, dan utilitas yang dibangun?",
      options: [
        { value: 1, label: "Sangat buruk" },
        { value: 2, label: "Kurang baik" },
        { value: 3, label: "Baik" },
        { value: 4, label: "Sangat baik" },
      ],
    },
    {
      id: "s2", key: "B2", label: "Kesesuaian Kebutuhan",
      text: "Sejauh mana PSU yang dibangun sesuai dengan kebutuhan masyarakat?",
      options: [
        { value: 1, label: "Tidak sesuai" },
        { value: 2, label: "Kurang sesuai" },
        { value: 3, label: "Sesuai" },
        { value: 4, label: "Sangat sesuai" },
      ],
    },
    {
      id: "s3", key: "B3", label: "Dampak Lingkungan",
      text: "Bagaimana dampak pembangunan PSU terhadap lingkungan sekitar?",
      options: [
        { value: 1, label: "Sangat negatif" },
        { value: 2, label: "Kurang positif" },
        { value: 3, label: "Positif" },
        { value: 4, label: "Sangat positif" },
      ],
    },
  ],
  "Bantuan Rumah Susun (Rusun)": [
    {
      id: "s1", key: "B1", label: "Kualitas Bangunan Unit",
      text: "Bagaimana kualitas bangunan unit hunian yang ditempati?",
      options: [
        { value: 1, label: "Sangat buruk" },
        { value: 2, label: "Kurang baik" },
        { value: 3, label: "Baik" },
        { value: 4, label: "Sangat baik" },
      ],
    },
    {
      id: "s2", key: "B2", label: "Ketersediaan Utilitas",
      text: "Bagaimana ketersediaan utilitas (air, listrik, sanitasi) di unit Anda?",
      options: [
        { value: 1, label: "Tidak tersedia" },
        { value: 2, label: "Kurang memadai" },
        { value: 3, label: "Memadai" },
        { value: 4, label: "Sangat memadai" },
      ],
    },
    {
      id: "s3", key: "B3", label: "Fasilitas Meubelair",
      text: "Bagaimana kelengkapan fasilitas meubelair yang disediakan?",
      options: [
        { value: 1, label: "Tidak lengkap" },
        { value: 2, label: "Kurang lengkap" },
        { value: 3, label: "Lengkap" },
        { value: 4, label: "Sangat lengkap" },
      ],
    },
    {
      id: "s4", key: "B4", label: "Area Bersama",
      text: "Bagaimana kondisi dan pengelolaan area bersama rusun?",
      options: [
        { value: 1, label: "Sangat buruk" },
        { value: 2, label: "Kurang baik" },
        { value: 3, label: "Baik" },
        { value: 4, label: "Sangat baik" },
      ],
    },
  ],
  "Bantuan Penanganan Kawasan Kumuh": [
    {
      id: "s1", key: "B1", label: "Perubahan Wajah Kawasan",
      text: "Bagaimana perubahan wajah kawasan setelah penanganan?",
      options: [
        { value: 1, label: "Tidak berubah" },
        { value: 2, label: "Sedikit berubah" },
        { value: 3, label: "Berubah signifikan" },
        { value: 4, label: "Sangat berubah" },
      ],
    },
    {
      id: "s2", key: "B2", label: "Fungsi Sanitasi & Air Bersih",
      text: "Bagaimana fungsi sarana sanitasi dan air bersih yang dibangun?",
      options: [
        { value: 1, label: "Tidak berfungsi" },
        { value: 2, label: "Kurang berfungsi" },
        { value: 3, label: "Berfungsi" },
        { value: 4, label: "Berfungsi sangat baik" },
      ],
    },
    {
      id: "s3", key: "B3", label: "Aksesibilitas",
      text: "Bagaimana aksesibilitas kawasan setelah penanganan?",
      options: [
        { value: 1, label: "Tidak ada perubahan" },
        { value: 2, label: "Sedikit membaik" },
        { value: 3, label: "Membaik" },
        { value: 4, label: "Sangat membaik" },
      ],
    },
    {
      id: "s4", key: "B4", label: "Pelibatan Masyarakat",
      text: "Bagaimana pelibatan masyarakat dalam proses penanganan?",
      options: [
        { value: 1, label: "Tidak dilibatkan" },
        { value: 2, label: "Kurang dilibatkan" },
        { value: 3, label: "Dilibatkan" },
        { value: 4, label: "Sangat dilibatkan" },
      ],
    },
  ],
}

export const IKM_CATEGORIES: IKMCategory[] = [
  {
    label: "A",
    name: "Sangat Baik",
    min: 88.31,
    max: 100,
    color: "#16a34a",
    bgClass: "bg-green-600",
    textClass: "text-green-700",
  },
  {
    label: "B",
    name: "Baik",
    min: 76.61,
    max: 88.3,
    color: "#2563eb",
    bgClass: "bg-blue-600",
    textClass: "text-blue-700",
  },
  {
    label: "C",
    name: "Kurang Baik",
    min: 65.0,
    max: 76.6,
    color: "#d97706",
    bgClass: "bg-amber-500",
    textClass: "text-amber-700",
  },
  {
    label: "D",
    name: "Tidak Baik",
    min: 25.0,
    max: 64.99,
    color: "#dc2626",
    bgClass: "bg-red-600",
    textClass: "text-red-700",
  },
]
