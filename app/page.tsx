import Navigation from "@/components/Navigation"
import { Barcode, Boxes, ClipboardList, PackageCheck } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-center">
          Supermarket Inventory
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/scan"
            className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Barcode className="h-8 w-8 mb-2 text-primary" />
            <span className="text-sm font-medium">Scan Products</span>
          </Link>

          <Link
            href="/receive"
            className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <PackageCheck className="h-8 w-8 mb-2 text-primary" />
            <span className="text-sm font-medium">Receive Products</span>
          </Link>

          <Link
            href="/orders"
            className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <ClipboardList className="h-8 w-8 mb-2 text-primary" />
            <span className="text-sm font-medium">Orders</span>
          </Link>

          <Link
            href="/inventory"
            className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Boxes className="h-8 w-8 mb-2 text-primary" />
            <span className="text-sm font-medium">Inventory</span>
          </Link>
        </div>
      </main>
      <Navigation />
    </div>
  )
}
