import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'cURL → Fetch | Convert cURL to JavaScript instantly',
  icons: {
  icon: [
    { url: "/curlfav.png", sizes: "32x32", type: "image/png" },
  ],
},
  description:
    'Paste any cURL command and instantly get clean fetch() or axios code. No more manual translation.',
  keywords: ['curl', 'fetch', 'axios', 'converter', 'developer tool', 'javascript'],
  openGraph: {
    title: 'cURL → Fetch',
    description: 'Convert cURL commands to fetch() or axios instantly.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
