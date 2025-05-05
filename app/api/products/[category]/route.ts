import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Category } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: Category }> }
) {
  const { category } = await params

  if (!category) {
    return new Response("Category is required", { status: 400 })
  }

  const products = await prisma.product.findMany({
    where: { category },
  })

  if (!products) {
    return new Response("Products not found for this category", { status: 404 })
  }

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "3600",
    },
  })
}
