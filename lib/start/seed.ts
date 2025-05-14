import { PrismaClient, Category } from "@prisma/client"
import products from "@/lib/start/products.json"

const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      category: Category[product.category as keyof typeof Category],
    })),
  })
}

main()
  .then(() => console.log("Seed complete"))
  .catch((e) => {
    console.error("Error seeding products:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
