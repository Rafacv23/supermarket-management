"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Barcode, ClipboardList, House, PackageCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()

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
        {isCurrentPath("/") ? (
          <span className="flex items-center gap-2">
            <House size={20} />
            Inicio
          </span>
        ) : (
          <House size={20} />
        )}
      </Link>
      <Link
        className={buttonVariants({
          variant: isCurrentPath("/scan") ? "default" : "secondary",
        })}
        href="/scan"
        title="Escanear producto"
      >
        {isCurrentPath("/scan") ? (
          <span className="flex items-center gap-2">
            <Barcode size={20} />
            Escanear
          </span>
        ) : (
          <Barcode size={20} />
        )}
      </Link>
      <Link
        className={buttonVariants({
          variant: isCurrentPath("/receive") ? "default" : "secondary",
        })}
        href="/receive"
        title="Recepción de pedidos"
      >
        {isCurrentPath("/receive") ? (
          <span className="flex items-center gap-2">
            <PackageCheck size={20} />
            Bajar
          </span>
        ) : (
          <PackageCheck size={20} />
        )}
      </Link>
      <Link
        className={buttonVariants({
          variant: isCurrentPath("/upload") ? "default" : "secondary",
        })}
        href="/upload"
        title="Subir mercancía"
      >
        {isCurrentPath("/upload") ? (
          <span className="flex items-center gap-2">
            <ClipboardList size={20} />
            Subir
          </span>
        ) : (
          <ClipboardList size={20} />
        )}
      </Link>
    </footer>
  )
}
