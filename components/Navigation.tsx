"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowDown, ArrowUp, Barcode, House, Plus } from "lucide-react"
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
        <span className="flex flex-col items-center">
          <House size={20} />
          Pedidos
        </span>
      </Link>

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/scan") ? "default" : "secondary",
        })}
        href="/scan"
        title="Escanear producto"
      >
        <span className="flex flex-col items-center">
          <Barcode size={20} />
          Escaner
        </span>
      </Link>

      <FormTrigger
        aria-label="Nuevo producto"
        icon={<Plus size={20} />}
        description="Enviar pedido de mercancía"
        form={<NewProductForm />}
      />

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/receive") ? "default" : "secondary",
        })}
        href="/receive"
        title="Recepción de pedidos"
      >
        <span className="flex flex-col items-center">
          <ArrowDown size={20} />
          Bajar
        </span>
      </Link>

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/upload") ? "default" : "secondary",
        })}
        href="/upload"
        title="Subir mercancía"
      >
        <span className="flex flex-col items-center">
          <ArrowUp size={20} />
          Subir
        </span>
      </Link>
    </footer>
  )
}
