import { PrismaClient, Category } from "@prisma/client"
import { map } from "./seed.json"

const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: map((product) => ({
      ...product,
      category: Category[product.category],
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
