import {
  Barcode,
  Boxes,
  ClipboardList,
  House,
  PackageCheck,
} from "lucide-react"
import Link from "next/link"

export default function Navigation() {
  return (
    <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center fixed bottom-0 left-0 right-0 mb-8">
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/"
        title="Inicio"
      >
        <House size={16} />
        Inicio
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/scan"
        title="Escanear producto"
      >
        <Barcode size={16} />
        Escaner
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/receive"
        title="Recepción de pedidos"
      >
        <PackageCheck size={16} />
        Recepción
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/upload"
        title="Subir mercancía"
      >
        <ClipboardList size={16} />
        Subir
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/inventory"
        title="Comprobar almacén"
      >
        <Boxes size={16} />
        Almacén
      </Link>
    </footer>
  )
}
