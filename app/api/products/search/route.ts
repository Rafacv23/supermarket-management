import { prisma } from "@/lib/prisma"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return new Response("Query is required", { status: 400 })
  }

  const products = await prisma.product.findMany({
    where: { name: { contains: query } },
    take: 10, // Limit the number of results to 10
  })

  if (!products) {
    return new Response("Products not found", { status: 404 })
  }

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "3600",
    },
  })
}
