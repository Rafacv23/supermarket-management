import { prisma } from "@/lib/prisma"
import { formatString } from "@/lib/utils"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.trim()

  if (!query) {
    return new Response("Query is required", { status: 400 })
  }

  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 25
  const skip = Math.max((page - 1) * limit, 0)

  const words = query.trim().split(/\s+/) // ["aceite", "auchan"]

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          AND: words.map((word) => ({
            name: { contains: word, mode: "insensitive" },
          })),
        },
        {
          AND: words.map((word) => ({
            brand: { contains: word, mode: "insensitive" },
          })),
        },
      ],
    },
    select: {
      barcode: true,
      name: true,
      brand: true,
      category: true,
    },
    skip,
    take: limit,
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
      "Cache-Control": "public, max-age=120, stale-while-revalidate=120",
    },
  })
}
