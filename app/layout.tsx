import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CMS Workbench - shadcn/ui Components",
  description: "Development workbench for CMSNext with shadcn/ui components",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
