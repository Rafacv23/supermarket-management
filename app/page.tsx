"use client"

import Container from "@/components/Container"
import { SITE_TITLE } from "@/lib/constants"
import { usePendingOrders } from "@/lib/queries/orders"
import { Barcode, ClipboardList, Loader, PackageCheck } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: pendingOrders, isLoading, isError } = usePendingOrders()

  return (
    <Container>
      <h1>{SITE_TITLE}</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/scan"
          className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <Barcode className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Escanear producto</span>
        </Link>
        <Link
          href="/receive"
          className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <PackageCheck className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Recepción de pedidos</span>
        </Link>
        <Link
          href="/orders"
          className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <ClipboardList className="h-8 w-8 mb-2 text-primary" />
          <span className="text-sm font-medium">Subir mercancía</span>
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 mt-4 text-muted-foreground">
          <Loader className="w-4 h-4 animate-spin" />
          Cargando pedidos...
        </div>
      )}

      {isError && (
        <div className="text-red-500 mt-4">
          Ocurrió un error al cargar los pedidos.
        </div>
      )}

      {(pendingOrders ?? []).length > 0 ? (
        <div>
          <h2 className="text-lg font-bold mt-4">Pedidos pendientes</h2>
          <ul className="mt-2">
            {(pendingOrders ?? []).map((order) => (
              <li key={order.id} className="flex items-center gap-2">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Pedido {order.id}
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
