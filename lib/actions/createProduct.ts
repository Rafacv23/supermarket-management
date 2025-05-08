"use server"

import { Category } from "@prisma/client"
import { prisma } from "../prisma"
import { revalidatePath } from "next/cache"

interface CreateProductProps {
  name: string
  category: Category
  barcode: string
  price?: number
  stock?: number
}

export default async function createProduct(product: CreateProductProps) {
  try {
    revalidatePath("/scan")
    return await prisma.product.create({
      data: product,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    throw new Error("Error creating product")
  }
}
