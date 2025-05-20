"use client"

import Container from "@/components/Container"
import { Barcode } from "lucide-react"
import Loading from "@/components/Loading"
import { useCallback, useEffect, useState } from "react"
import { Category, Product } from "@prisma/client"
import { searchProducts, useProductsByCategory } from "@/lib/queries/products"
import SearchFilters from "@/components/SearchFilters"
import { useScanner } from "@/hooks/useScanner"
const Scanner = dynamic(() => import("@/components/Scanner"), { ssr: false })
import dynamic from "next/dynamic"
import SearchProductForm from "@/components/forms/SearchProductForm"
import SearchedProductsList from "@/components/SearchedProductsList"

export default function ScanPage() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [category, setCategory] = useState<Category | undefined>()

  const { scanning, setScanning, handleScan } = useScanner(
    products,
    async (term) => {
      setSearchTerm(term)
      setScanning(false)
      await handleProductSearch(term)
    }
  )

  const handleProductSearch = useCallback(async (term: string) => {
    if (!term || term.trim().length < 1) {
      console.error("Por favor, introduce un término de búsqueda válido.")
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const results = await searchProducts(term)
      setProducts(results)
    } catch (err) {
      console.error("Error al obtener productos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await handleProductSearch(searchTerm)
  }

  const {
    data: categoryProducts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsByCategory(category)

  useEffect(() => {
    if (categoryProducts) {
      const flattenedProducts = categoryProducts.pages.flat()
      setProducts(flattenedProducts)
    }
  }, [categoryProducts])

  return (
    <Container>
      <h1 className="flex items-center gap-2">
        <Barcode /> Escanear productos
      </h1>
      <p>Escanea o añade nuevos productos.</p>
      <div className="w-full">
        <div className="mb-4">
          <SearchProductForm
            onSubmit={onSubmit}
            searchTerm={searchTerm}
            loading={loading}
            scanning={scanning}
            setScanning={setScanning}
            setSearchTerm={setSearchTerm}
          />
          <div className="mt-4 flex justify-between">
            <SearchFilters
              aria-disabled={loading}
              category={category}
              setCategory={setCategory}
            />
          </div>
        </div>
      </div>

      {scanning && <Scanner onDetected={handleScan} />}

      {isLoading && <Loading />}

      {isError && (
        <div className="text-red-500 mt-4">
          Ocurrió un error al cargar los productos.
        </div>
      )}

      <SearchedProductsList
        category={category}
        products={products}
        hasSearched={hasSearched}
        searchTerm={searchTerm}
        categoryProducts={categoryProducts}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </Container>
  )
}
