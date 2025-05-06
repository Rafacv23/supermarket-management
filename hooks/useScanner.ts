// hooks/useBarcodeScanner.ts
import { Product } from "@prisma/client"
import { useState } from "react"

export function useScanner(products?: Product[]) {
  const [scanning, setScanning] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const handleScan = (result: string) => {
    setSearchTerm(result)
    if (products) {
      const filtered = products.filter((product) =>
        product.barcode.includes(result)
      )
      setFilteredProducts(filtered)
    }
  }

  return {
    scanning,
    setScanning,
    searchTerm,
    filteredProducts,
    handleScan,
  }
}
