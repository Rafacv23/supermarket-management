import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"
import { Toaster } from "@/components/ui/sonner"
import ClientFetchProvider from "@/components/ClientFetchProvider"
import { Suspense } from "react"

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Alcampo Bustarviejo",
  description: "Gestiona tus productos y maneja tus pedidos.",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`dark ${jetBrainsMono.variable} antialiased`}>
        <ClientFetchProvider>
          {children}
          <Navigation />
          <Suspense>
            <Toaster closeButton richColors position="top-center" />
          </Suspense>
        </ClientFetchProvider>
      </body>
    </html>
  )
}
