import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/Navigation"
import { Toaster } from "@/components/ui/sonner"
import ClientFetchProvider from "@/components/ClientFetchProvider"
import { Suspense } from "react"
import GoingUpBtn from "@/components/GoingUpBtn"

export const metadata: Metadata = {
  title: "Alcampo Bustarviejo",
  description: "Gestiona tus productos y maneja tus pedidos.",
  manifest: "/manifest.json",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        <ClientFetchProvider>
          {children}
          <Navigation />
          <GoingUpBtn />
          <Suspense>
            <Toaster closeButton richColors position="top-center" />
          </Suspense>
        </ClientFetchProvider>
      </body>
    </html>
  )
}
