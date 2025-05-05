"use client"

import Container from "@/components/Container"
import SearchFilters from "@/components/SearchFilters"
import { Category } from "@prisma/client"
import { useEffect, useState } from "react"
import { getProductsByCategory } from "@/lib/queries/products"

export default function InventoryPage() {
  const [category, setCategory] = useState<Category>(undefined)

  useEffect(() => {
    if (category) {
      getProductsByCategory(category).then((products) => {
        console.log(products)
      })
    }
  }, [category])

  return (
    <Container>
      <h1>Inventario</h1>
      <p>Lista con todos los productos en el almacen.</p>
      <SearchFilters category={category} setCategory={setCategory} />
      <p>Categoria seleccionada: {category}</p>
      <ul>
        {category && (
          <li>
            <a href={`/inventory/${category}`}>Ver todos los productos</a>
          </li>
        )}
      </ul>
    </Container>
  )
}
