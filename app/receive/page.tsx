"use client"

import Container from "@/components/Container"
import FormTrigger from "@/components/FormTrigger"
import { Button } from "@/components/ui/button"
import { PackageCheck } from "lucide-react"
import ReceiveProductForm from "@/components/forms/ReceiveProductForm"
import { useState } from "react"
import receiveProduct from "@/lib/actions/receiveProduct"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useReceiveStore } from "@/store/receiveStore"

export default function ReceivePage() {
  const { receivedProducts, removeProduct, clearOrder } = useReceiveStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendReceive = async () => {
    try {
      setLoading(true)
      setError("")
      // Llamar a la acción del servidor
      await receiveProduct({ products: receivedProducts })
      // Limpia el store si el envío fue exitoso
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
      <h1>Recibir Pedido</h1>
      <p>Añadir productos al almacen, tras recibirlos.</p>
      <FormTrigger
        icon={<PackageCheck />}
        title="Recibir productos"
        description="Añade todos los productos que hayas recibido."
        form={<ReceiveProductForm />}
      />

      <div>
        {receivedProducts.length === 0 ? null : (
          <ul className="space-y-2">
            {receivedProducts.map((product) => (
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

        {receivedProducts.length > 0 && (
          <Button onClick={handleSendReceive} disabled={loading}>
            {loading ? "Enviando..." : "Confirmar y Enviar"}
          </Button>
        )}
      </div>
    </Container>
  )
}
