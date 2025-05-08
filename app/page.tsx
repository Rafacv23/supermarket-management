import Container from "@/components/Container"
import Hero from "@/components/Hero"
import { getPendingOrders } from "@/lib/queries/orders"
import { Suspense } from "react"
import Loading from "@/components/Loading"
import Orders from "@/components/Orders"

export default async function Home() {
  const pendingOrders = (await getPendingOrders()) || undefined

  return (
    <Container>
      <Hero />
      <Suspense fallback={<Loading />}>
        <Orders pendingOrders={pendingOrders} />
      </Suspense>
    </Container>
  )
}
