import { prisma } from "@/lib/prisma"
import { formatString } from "@/lib/utils"
import { type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params

  if (!barcode) {
    return new Response("Barcode is required", { status: 400 })
  }

  const product = await prisma.product.findUnique({
    where: { barcode },
    select: {
      barcode: true,
      name: true,
      brand: true,
      category: true,
      stock: true,
    },
  })

  if (!product) {
    return new Response("Product not found", { status: 404 })
  }

  const formattedProduct = {
    ...product,
    name: formatString(product.name),
    brand: formatString(product.brand ?? ""),
  }

  return new Response(JSON.stringify(formattedProduct), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "3600",
    },
  })
}
