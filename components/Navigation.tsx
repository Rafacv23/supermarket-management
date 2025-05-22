"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowUp, Barcode, House, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import FormTrigger from "./FormTrigger"
import NewProductForm from "./forms/NewProductForm"

export default function Navigation() {
  const pathname = usePathname()

  if (pathname === "/login") return null

  const isCurrentPath = (path: string) => pathname === path

  return (
    <footer
      className="row-start-3 rounded-2xl mb-2 mx-2 flex gap-2 flex-wrap items-center justify-center fixed bottom-0 left-0 right-0 bg-card text-card-foreground p-6"
      role="contentinfo"
    >
      <Link
        className={buttonVariants({
          variant: isCurrentPath("/") ? "default" : "secondary",
        })}
        href="/"
        title="Inicio"
      >
        <House size={20} />
        Pedidos
      </Link>

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/scan") ? "default" : "secondary",
        })}
        href="/scan"
        title="Escanear producto"
      >
        <Barcode size={20} />
        Escaner
      </Link>

      <FormTrigger
        aria-label="Nuevo producto"
        icon={<Plus size={20} />}
        description="Enviar pedido de mercancía"
        form={<NewProductForm />}
      />

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/upload") ? "default" : "secondary",
        })}
        href="/upload"
        title="Subir mercancía"
      >
        <ArrowUp size={20} />
        Subir
      </Link>
    </footer>
  )
}
