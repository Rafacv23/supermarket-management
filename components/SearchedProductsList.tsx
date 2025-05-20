"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Loading from "@/components/Loading"
import ProductCard from "@/components/ProductCard"
import FormTrigger from "@/components/FormTrigger"
import NewProductForm from "@/components/forms/NewProductForm"
import { Plus } from "lucide-react"
import type { Product, Category } from "@prisma/client"
import type { InfiniteData } from "@tanstack/react-query"

type Props = {
  category?: Category
  products: Product[]
  hasSearched: boolean
  searchTerm: string
  categoryProducts?: InfiniteData<Product[]>
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export default function SearchedProductsList({
  category,
  products,
  hasSearched,
  searchTerm,
  categoryProducts,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) {
  if (category && categoryProducts) {
    return (
      <Suspense fallback={<Loading />}>
        <div className="w-full">
          <h2 className="mb-4 font-bold">
            Productos encontrados para: {category}
          </h2>
          {categoryProducts.pages.map((group, i) => (
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
          {hasNextPage && fetchNextPage && (
            <div className="flex justify-center mt-4">
              <Button onClick={fetchNextPage} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? "Cargando más..." : "Cargar más"}
              </Button>
            </div>
          )}
        </div>
      </Suspense>
    )
  }

  if (products.length > 0) {
    return (
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
    )
  }

  if (hasSearched) {
    return (
      <div>
        <p>No se han encontrado productos para {searchTerm}</p>
        <div className="flex flex-col items-center gap-2 mt-4">
          <FormTrigger
            aria-label="Nuevo producto"
            icon={<Plus size={20} />}
            description="Enviar pedido de mercancía"
            form={<NewProductForm barcode={searchTerm} />}
          />
          <p>Añadir nuevo producto</p>
        </div>
      </div>
    )
  }

  return null
}
