import { Barcode, ClipboardList, House, PackageCheck } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function Navigation() {
  return (
    <footer className="row-start-3 rounded-2xl mb-2 mx-2 flex gap-[24px] flex-wrap items-center justify-center fixed bottom-0 left-0 right-0 bg-secondary text-secondary-foreground p-6">
      <Link
        className={buttonVariants({
          variant: "default",
        })}
        href="/"
        title="Inicio"
      >
        <House size={16} />
        Inicio
      </Link>
      <Link
        className={buttonVariants({
          variant: "default",
        })}
        href="/scan"
        title="Escanear producto"
      >
        <Barcode size={16} />
        Escaner
      </Link>
      <Link
        className={buttonVariants({
          variant: "default",
        })}
        href="/receive"
        title="Recepción de pedidos"
      >
        <PackageCheck size={16} />
        Recepción
      </Link>
      <Link
        className={buttonVariants({
          variant: "default",
        })}
        href="/upload"
        title="Subir mercancía"
      >
        <ClipboardList size={16} />
        Subir
      </Link>
    </footer>
  )
}
