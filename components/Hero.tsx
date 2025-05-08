import { Barcode, ClipboardList, PackageCheck } from "lucide-react"
import { SITE_TITLE } from "@/lib/constants"
import Link from "next/link"

export default function Hero() {
  return (
    <>
      <h1>{SITE_TITLE}</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/scan"
          className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <Barcode className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Escanear producto</span>
        </Link>
        <Link
          href="/receive"
          className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <PackageCheck className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Bajar mercancía</span>
        </Link>
        <Link
          href="/upload"
          className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <ClipboardList className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Subir mercancía</span>
        </Link>
      </div>
    </>
  )
}
