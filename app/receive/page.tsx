"use client"

import Container from "@/components/Container"
import FormTrigger from "@/components/FormTrigger"
import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  Barcode,
  Boxes,
  Loader,
  PackageCheck,
  Save,
  Trash,
} from "lucide-react"
import ReceiveProductForm from "@/components/forms/ReceiveProductForm"
import { useState } from "react"
import receiveProduct from "@/lib/actions/receiveProduct"
import {
  Card,
  CardContent,
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

      {receivedProducts.length > 0 && (
        <div className="w-full">
          <ul className="space-y-2 mb-4">
            {receivedProducts.map((product) => (
              <li key={product.barcode}>
                <Card>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Barcode size={16} /> {product.barcode}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center gap-2">
                      <Boxes size={16} /> Almacen {product.currentStock} uds
                    </p>
                    <p className="flex items-center gap-2">
                      <ArrowDown size={16} /> Bajar {product.stock} uds
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => removeProduct(product.barcode)}
                      variant="destructive"
                    >
                      <Trash size={16} /> Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>

          {error && <p className="text-red-500">{error}</p>}

          <Button onClick={handleSendReceive} disabled={loading}>
            {loading ? (
              <span className="animate-ping flex items-center gap-2">
                <Loader size={16} />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={16} /> Confirmar y enviar
              </span>
            )}
          </Button>
        </div>
      )}
    </Container>
  )
}
