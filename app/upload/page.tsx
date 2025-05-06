"use client"

import Container from "@/components/Container"
import { useOrderStore } from "@/store/orderStore"
import { useState } from "react"
import { ClipboardList } from "lucide-react"
import UploadProductForm from "@/components/forms/UploadProductForm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card"
import uploadProductAndCreateOrder from "@/lib/actions/createOrder"
import FormTrigger from "@/components/FormTrigger"

export default function UploadPage() {
  const { order, removeProduct, clearOrder } = useOrderStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOrder = async () => {
    try {
      setLoading(true)
      setError("")

      await uploadProductAndCreateOrder({
        employeeId: "admin",
        products: order,
      })

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
      <FormTrigger
        title="Subir"
        icon={<ClipboardList size={16} />}
        form={<UploadProductForm />}
        description="Añade todos los productos que vayas a subir desde el almacen."
      />

      {order.length > 0 && (
        <div>
          <ul className="space-y-2 mb-4">
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

          {error && <p className="text-red-500">{error}</p>}

          <Button onClick={handleSendOrder} disabled={loading}>
            {loading ? "Enviando..." : "Confirmar y Enviar"}
          </Button>
        </div>
      )}
    </Container>
  )
}
