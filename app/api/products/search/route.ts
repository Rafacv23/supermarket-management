import { prisma } from "@/lib/prisma"
import { formatString } from "@/lib/utils"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return new Response("Query is required", { status: 400 })
  }

  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 25
  const skip = Math.max((page - 1) * limit, 0)

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      barcode: true,
      name: true,
      brand: true,
      category: true,
      stock: true,
    },
    skip,
    take: 25,
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
