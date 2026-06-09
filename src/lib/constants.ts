// Konstanta untuk SKM BP3KP Jawa III
// Kuesioner Hybrid — Permenpan-RB No. 14 Tahun 2017

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
  "Tidak sekolah",
  "SD/Sederajat",
  "SMP/Sederajat",
  "SMA/Sederajat",
  "D1/D2/D3",
  "D4/S1",
  "S2",
  "S3",
]

// Map old education values → new (for BukuTamu pre-fill compatibility)
export const EDUCATION_LEGACY_MAP: Record<string, string> = {
  "SD atau sederajat": "SD/Sederajat",
  "SMP atau sederajat": "SMP/Sederajat",
  "SMA atau sederajat": "SMA/Sederajat",
  "Diploma (D3)": "D1/D2/D3",
  "Sarjana (S1)": "D4/S1",
  "Magister (S2)": "S2",
  "Doktor (S3)": "S3",
}

export const GENDER_OPTIONS = ["Laki-laki", "Perempuan"]

export const AGE_GROUPS = [
  "< 17 tahun",
  "17-25 tahun",
  "26-34 tahun",
  "35-44 tahun",
  "45-54 tahun",
  "55-65 tahun",
  "> 65 tahun",
]

export const PEKERJAAN_OPTIONS = [
  "ASN",
  "TNI",
  "POLRI",
  "Swasta",
  "Wirausaha",
  "Ibu Rumah Tangga",
  "Pelajar/Mahasiswa",
  "Petani/Nelayan",
  "Pekerja Lepas/Freelance",
  "Pensiunan",
  "Lainnya",
]

export const DISABILITAS_OPTIONS = [
  "Disabilitas Fisik",
  "Disabilitas Intelektual",
  "Disabilitas Mental",
  "Disabilitas Sensorik",
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

// 19 sub-questions — Kuesioner Hybrid
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "nq1", key: "P1", label: "Informasi Pelayanan",
    text: "Informasi pelayanan tersedia melalui media elektronik maupun nonelektronik",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq2", key: "P2", label: "Kesesuaian Persyaratan",
    text: "Kesesuaian persyaratan dengan informasi yang diberikan",
    options: [
      { value: 1, label: "Sangat tidak sesuai" },
      { value: 2, label: "Tidak sesuai" },
      { value: 3, label: "Sesuai" },
      { value: 4, label: "Sangat sesuai" },
    ],
  },
  {
    id: "nq3", key: "P3", label: "Standar Prosedur",
    text: "Standar dan prosedur layanan diinformasikan dengan jelas",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq4", key: "P4", label: "Kemudahan Prosedur",
    text: "Prosedur/Alur layanan mudah dipahami dan dilakukan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq5", key: "P5", label: "Integritas Prosedur",
    text: "Layanan diberikan sesuai prosedur tanpa kecurangan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq6", key: "P6", label: "Waktu Layanan",
    text: "Jangka waktu layanan sesuai dengan yang diinformasikan",
    options: [
      { value: 1, label: "Sangat tidak sesuai" },
      { value: 2, label: "Tidak sesuai" },
      { value: 3, label: "Sesuai" },
      { value: 4, label: "Sangat sesuai" },
    ],
  },
  {
    id: "nq7", key: "P7", label: "Kesesuaian Biaya",
    text: "Biaya layanan sesuai dengan yang diinformasikan",
    options: [
      { value: 1, label: "Sangat tidak sesuai" },
      { value: 2, label: "Tidak sesuai" },
      { value: 3, label: "Sesuai" },
      { value: 4, label: "Sangat sesuai" },
    ],
  },
  {
    id: "nq8", key: "P8", label: "Bebas Pungli",
    text: "Tidak ada pungutan liar (pungli) dalam pelayanan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq9", key: "P9", label: "Bebas Percaloan",
    text: "Tidak ada percaloan/perantara tidak resmi dalam pelayanan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq10", key: "P10", label: "Kesesuaian Produk",
    text: "Produk layanan yang diterima sesuai dengan yang dipublikasikan",
    options: [
      { value: 1, label: "Sangat tidak sesuai" },
      { value: 2, label: "Tidak sesuai" },
      { value: 3, label: "Sesuai" },
      { value: 4, label: "Sangat sesuai" },
    ],
  },
  {
    id: "nq11a", key: "P11a", label: "Respons Petugas",
    text: "Petugas merespon kebutuhan dengan cepat",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq11b", key: "P11b", label: "Respons Aplikasi",
    text: "Aplikasi sistem pelayanan merespon kebutuhan dengan cepat (membuka halaman, konten, pencarian informasi, unduh/unggah)",
    options: [
      { value: 1, label: "Sangat tidak cepat" },
      { value: 2, label: "Tidak cepat" },
      { value: 3, label: "Cepat" },
      { value: 4, label: "Sangat cepat" },
    ],
  },
  {
    id: "nq12a", key: "P12a", label: "Keramahan Petugas",
    text: "Petugas melayani saya dengan ramah",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq12b", key: "P12b", label: "Kemudahan Fitur",
    text: "Fitur pada aplikasi sistem layanan mudah digunakan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq13", key: "P13", label: "Keadilan Layanan",
    text: "Seluruh pengguna layanan dilayani secara adil tanpa diskriminasi",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq14", key: "P14", label: "Bebas Imbalan",
    text: "Pelayanan diberikan tanpa imbalan uang, barang, atau fasilitas di luar aturan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq15", key: "P15", label: "Akses Pengaduan",
    text: "Layanan konsultasi dan pengaduan mudah diakses",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq16a", key: "P16a", label: "Sarana Prasarana",
    text: "Sarana prasarana nyaman dan mudah digunakan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
  {
    id: "nq16b", key: "P16b", label: "Sistem Online",
    text: "Sistem layanan online nyaman dan mudah digunakan",
    options: [
      { value: 1, label: "Sangat tidak setuju" },
      { value: 2, label: "Tidak setuju" },
      { value: 3, label: "Setuju" },
      { value: 4, label: "Sangat setuju" },
    ],
  },
]

// 9 Unsur IKM — used in reports and dashboard
export const IKM_UNSUR_LABELS = [
  { key: "U1", label: "Persyaratan" },
  { key: "U2", label: "Prosedur" },
  { key: "U3", label: "Waktu Penyelesaian" },
  { key: "U4", label: "Biaya/Tarif" },
  { key: "U5", label: "Produk Layanan" },
  { key: "U6", label: "Kompetensi Pelaksana" },
  { key: "U7", label: "Perilaku Pelaksana" },
  { key: "U8", label: "Penanganan Pengaduan" },
  { key: "U9", label: "Sarana dan Prasarana" },
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

// Pertanyaan khusus per program bantuan perumahan (Seksi B kuesioner) — unchanged
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
