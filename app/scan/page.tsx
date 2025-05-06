"use client"

import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Search, Plus } from "lucide-react"
import NewProductForm from "@/components/forms/NewProductForm"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
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
    try {
      if (!searchTerm || searchTerm.length < 1) {
        console.error("No se ha introducido un código de barras")
        return
      }

      let products = []

      const isBarcode = /^[0-9]{12,13}$/.test(searchTerm)
      if (isBarcode) {
        // Buscar por código de barras
        products = await getProductByBarcode(searchTerm)
      } else {
        // Buscar por nombre o consulta general
        products = await getProductsByQuery(searchTerm)
      }

      setProducts(Array.isArray(products) ? products : [products])
    } catch (error) {
      console.error("Error al obtener los productos:", error)
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
        <form onSubmit={onSubmit}>
          Buscar productos
          <div className="flex gap-2">
            <Input
              type="search"
              value={searchTerm || scannedTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre o código de barras"
            />
            <Button type="submit" className="gap-1">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
            <Button
              type="button"
              variant={scanning ? "destructive" : "outline"}
              onClick={() => setScanning(!scanning)}
              className="gap-1"
            >
              <Camera className="w-4 h-4" />
              {scanning ? "Cerrar cámara" : "Escanear"}
            </Button>
          </div>
        </form>
        <SearchFilters category={category} setCategory={setCategory} />
      </div>

      {scanning && <Scanner onDetected={handleScan} />}

      <FormTrigger
        icon={<Plus />}
        title="Añadir nuevo producto"
        description="Añade nuevos productos a tu almacén"
        form={<NewProductForm />}
      />

      {isLoading && <Loading />}

      {isError && (
        <div className="text-red-500 mt-4">
          Ocurrió un error al cargar los productos.
        </div>
      )}

      {products.length > 0 ? (
        <div>
          <h2>Productos encontrados para {searchTerm || scannedTerm}</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No se han encontrado productos</p>
      )}
    </Container>
  )
}
