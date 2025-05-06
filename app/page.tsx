"use client"

import Container from "@/components/Container"
import { usePendingOrders } from "@/lib/queries/orders"
import Link from "next/link"
import Loading from "@/components/Loading"
import Hero from "@/components/Hero"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  const { data: pendingOrders, isLoading, isError } = usePendingOrders()

  return (
    <Container>
      <Hero />

      {isLoading && <Loading />}

      {isError && (
        <div className="text-red-500 mt-4">
          Ocurrió un error al cargar los pedidos.
        </div>
      )}

      {(pendingOrders ?? []).length > 0 ? (
        <div>
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
    </Container>
  )
}
