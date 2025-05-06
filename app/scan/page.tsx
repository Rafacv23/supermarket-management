"use client"

import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Search, Plus } from "lucide-react"
import NewProductForm from "@/components/forms/NewProductForm"
import Loading from "@/components/Loading"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { buttonVariants } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Category, Product } from "@prisma/client"
import BarcodeScanner from "react-qr-barcode-scanner"
import {
  getProductByBarcode,
  getProductsByQuery,
  useProductsByCategory,
} from "@/lib/queries/products"
import ProductCard from "@/components/ProductCard"
import SearchFilters from "@/components/SearchFilters"

export default function ScanPage() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [scanning, setScanning] = useState<boolean>(false)
  const [category, setCategory] = useState<Category | undefined>()

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

  function handleScan(result: string) {
    setSearchTerm(result)
    setScanning(false)
    const results = products.filter((p) => p.barcode === result)
    setProducts(results)
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
              value={searchTerm}
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

      {scanning && (
        <div className="mt-4 max-w-sm border rounded-md overflow-hidden">
          <BarcodeScanner
            width={300}
            height={300}
            onUpdate={(err, result) => {
              if (result) {
                handleScan(result.getText())
              }
            }}
          />
        </div>
      )}
      <Drawer>
        <DrawerTrigger className={buttonVariants({ variant: "default" })}>
          <Plus /> Añadir nuevo producto
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Añadir nuevo producto</DrawerTitle>
            <DrawerDescription>
              Añade nuevos productos a tu almacén.
            </DrawerDescription>
          </DrawerHeader>
          <NewProductForm />
        </DrawerContent>
      </Drawer>

      {isLoading && <Loading />}

      {isError && (
        <div className="text-red-500 mt-4">
          Ocurrió un error al cargar los productos.
        </div>
      )}

      {products.length > 0 ? (
        <div>
          <h2>Productos encontrados para {searchTerm}</h2>
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
