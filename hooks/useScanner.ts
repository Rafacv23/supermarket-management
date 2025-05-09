// hooks/useBarcodeScanner.ts
import { Product } from "@prisma/client"
import { useState } from "react"

export function useScanner(
  products?: Product[],
  onScan?: (term: string) => void // <- callback
) {
  const [scanning, setScanning] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const handleScan = (result: string) => {
    setSearchTerm(result + " ") // temporarily add a space to force state change
    setTimeout(() => setSearchTerm(result), 0) // restore real value immediately
    setScanning(false)

    if (products) {
      const filtered = products.filter((product) =>
        product.barcode.includes(result)
      )
      setFilteredProducts(filtered)
    }

    onScan?.(result)
  }

  return {
    scanning,
    setScanning,
    searchTerm,
    filteredProducts,
    handleScan,
  }
}
