"use client"

import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Search, Plus, Loader } from "lucide-react"
import NewProductForm from "@/components/forms/NewProductForm"
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
import FormTrigger from "@/components/FormTrigger"

export default function ScanPage() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | undefined>()

  const {
    scanning,
    setScanning,
    searchTerm: scannedTerm,
    handleScan,
  } = useScanner(products)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
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
  } = useProductsByCategory(category)

  useEffect(() => {
    if (categoryProducts) {
      setProducts(categoryProducts)
    }
  }, [categoryProducts])

  return (
    <Container>
      <h1>Escanear productos</h1>
      <p>Escanea o añade nuevos productos.</p>
      <div>
        <form onSubmit={onSubmit} className="mb-4">
          Buscar productos
          <div className="flex gap-2">
            <Input
              type="search"
              value={searchTerm || scannedTerm}
              disabled={loading}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre o código de barras"
            />
            <SearchFilters
              aria-disabled={loading}
              category={category}
              setCategory={setCategory}
            />
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
          <footer className="flex justify-between mt-4">
            <Button type="submit" className="gap-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="w-4 h-4 animate-spin" />{" "}
                  Buscando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search size={16} className="w-4 h-4" /> Buscar
                </span>
              )}
            </Button>
            <FormTrigger
              aria-disabled={loading}
              icon={<Plus />}
              title="Añadir nuevo producto"
              description="Añade nuevos productos a tu almacén"
              form={<NewProductForm />}
            />
          </footer>
        </form>
      </div>

      {scanning && <Scanner onDetected={handleScan} />}

      {isLoading && <Loading />}

      {isError && (
        <div className="text-red-500 mt-4">
          Ocurrió un error al cargar los productos.
        </div>
      )}

      {products.length > 0 ? (
        <Suspense fallback={<Loading />}>
          <div className="w-full">
            <h2 className="mb-4 font-bold">
              Productos encontrados para: {searchTerm || scannedTerm}
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
        <p>No se han encontrado productos</p>
      )}
    </Container>
  )
}
