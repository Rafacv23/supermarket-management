import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { Category } from "@prisma/client"
import { formatString } from "@/lib/utils"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: Category }> }
) {
  const { category } = await params

  const { searchParams } = req.nextUrl
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const skip = Math.max((page - 1) * limit, 0)

  if (!Object.values(Category).includes(category)) {
    return new Response("Invalid category", { status: 400 })
  }

  const products = await prisma.product.findMany({
    where: { category },
    select: {
      barcode: true,
      name: true,
      brand: true,
      category: true,
    },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  })

  if (!products) {
    return new Response("Products not found", { status: 404 })
  }

  const formattedProducts = products.map((product) => ({
    ...product,
    name: formatString(product.name),
    brand: formatString(product.brand ?? ""),
  }))

  return new Response(JSON.stringify(formattedProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=1200, stale-while-revalidate=120",
    },
  })
}
