import Container from "@/components/Container"
import Link from "next/link"
import Hero from "@/components/Hero"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getPendingOrders } from "@/lib/queries/orders"
import { Suspense } from "react"
import Loading from "@/components/Loading"

export default async function Home() {
  const pendingOrders = await getPendingOrders()

  return (
    <Container>
      <Hero />
      <Suspense fallback={<Loading />}>
        {pendingOrders ? (
          <div className="w-full">
            <h2 className="text-lg font-bold mt-4">Pedidos pendientes</h2>
            <ul className="mt-2 grid grid-cols-1 gap-4">
              {(pendingOrders ?? []).map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{order.id}</CardTitle>
                        <CardDescription>
                          {order.createdAt.toString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>Estado: {order.status}</CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4">No hay pedidos pendientes</p>
        )}
      </Suspense>
    </Container>
  )
}
