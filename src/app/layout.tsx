import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Survei Kepuasan Masyarakat — BP3KP Jawa III",
  description:
    "Survei Kepuasan Masyarakat (SKM) BP3KP Jawa III berdasarkan Permenpan-RB No. 14 Tahun 2017",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
