"use client"

import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Search, Loader, Barcode, X } from "lucide-react"
import Loading from "@/components/Loading"
import { Suspense, useEffect, useState } from "react"
import { Category, Product } from "@prisma/client"
import {
  getProductByBarcode,
  getProductsByQuery,
  useProductsByCategory,
} from "@/lib/queries/products"
import ProductCard from "@/components/ProductCard"
import SearchFilters from "@/components/SearchFilters"
import { useScanner } from "@/hooks/useScanner"
import Scanner from "@/components/Scanner"

export default function ScanPage() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [category, setCategory] = useState<Category | undefined>()

  const { scanning, setScanning, handleScan } = useScanner(products, (term) => {
    setSearchTerm(term)
    setHasSearched(false)
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setHasSearched(true)
    try {
      if (!searchTerm || searchTerm.length < 1) {
        console.error("No se ha introducido un código de barras")
        return
      }

      let products = []

      const isBarcode = /^[0-9]{12,13}$/.test(searchTerm)
      if (isBarcode) {
        // Buscar por código de barras
        products = [await getProductByBarcode(searchTerm)]
      } else {
        // Buscar por nombre o consulta general
        products = await getProductsByQuery(searchTerm)
      }

      setProducts(Array.isArray(products) ? products : [products])

      setSearchTerm("")
    } catch (error) {
      console.error("Error al obtener los productos:", error)
    } finally {
      setLoading(false)
    }
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
          <form onSubmit={onSubmit}>
            <p className="mb-2">Buscar productos</p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  type="search"
                  value={searchTerm}
                  disabled={loading}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre o código de barras"
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSearchTerm("")}
                  disabled={loading}
                >
                  <X size={16} />
                </Button>
                <Button
                  type="button"
                  variant={scanning ? "destructive" : "secondary"}
                  onClick={() => setScanning(!scanning)}
                  className="gap-2"
                  disabled={loading}
                >
                  <Camera size={16} />
                  {scanning ? "Cerrar cámara" : "Escanear"}
                </Button>
              </div>
              <Button type="submit" className="gap-1" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader size={16} className="w-4 h-4 animate-spin" />
                    Buscando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search size={16} className="w-4 h-4" />
                    Buscar
                  </span>
                )}
              </Button>
            </div>
          </form>
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

      {category ? (
        <Suspense fallback={<Loading />}>
          <div className="w-full">
            <h2 className="mb-4 font-bold">
              Productos encontrados para: {category}
            </h2>
            {categoryProducts?.pages.map((group, i) => (
              <ul
                key={i}
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                  i > 0 ? "mt-4" : ""
                }`}
              >
                {group.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ))}
            {hasNextPage && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Cargando más..." : "Cargar más"}
                </Button>
              </div>
            )}
          </div>
        </Suspense>
      ) : products.length > 0 ? (
        <Suspense fallback={<Loading />}>
          <div className="w-full">
            <h2 className="mb-4 font-bold">
              Productos encontrados: {products.length}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </Suspense>
      ) : (
        hasSearched && <p>No se han encontrado productos</p>
      )}
    </Container>
  )
}
