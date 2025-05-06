"use client"

import Container from "@/components/Container"
import uploadProduct from "@/lib/actions/uploadProduct"
import { useOrderStore } from "@/store/orderStore"
import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ClipboardList } from "lucide-react"
import UploadProductForm from "@/components/forms/UploadProductForm"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card"

export default function UploadPage() {
  const { order, removeProduct, clearOrder } = useOrderStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOrder = async () => {
    try {
      setLoading(true)
      setError("")

      await uploadProduct({ products: order })

      clearOrder()
      alert("Productos recibidos correctamente")
    } catch (err) {
      console.error(err)
      setError("Hubo un error al enviar los productos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <h1>Subir mercancía</h1>
      <p>Sube los productos desde el almacen.</p>
      <Drawer>
        <DrawerTrigger className={buttonVariants({ variant: "default" })}>
          <ClipboardList size={16} />
          Subir
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Subir productos</DrawerTitle>
            <DrawerDescription>
              Añade todos los productos que vayas a subir desde el almacen.
            </DrawerDescription>
          </DrawerHeader>
          <UploadProductForm />
        </DrawerContent>
      </Drawer>
      <div>
        {order.length === 0 ? (
          <p>No hay productos.</p>
        ) : (
          <ul className="space-y-2">
            {order.map((product) => (
              <li key={product.barcode}>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-medium">
                      {product.barcode}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      onClick={() => removeProduct(product.barcode)}
                      variant="destructive"
                    >
                      Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {order.length > 0 && (
          <Button onClick={handleSendOrder} disabled={loading}>
            {loading ? "Enviando..." : "Confirmar y Enviar"}
          </Button>
        )}
      </div>
    </Container>
  )
}
