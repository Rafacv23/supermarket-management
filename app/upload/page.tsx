"use client"

import Container from "@/components/Container"
import { useOrderStore } from "@/store/orderStore"
import { useState } from "react"
import {
  ArrowUp,
  Barcode,
  Boxes,
  ClipboardList,
  Loader,
  Save,
  Trash,
} from "lucide-react"
import UploadProductForm from "@/components/forms/UploadProductForm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
  CardContent,
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
        <div className="w-full">
          <ul className="space-y-2 mb-4">
            {order.map((product) => (
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
                      <ArrowUp size={16} /> Subir {product.stock} uds
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

          <Button onClick={handleSendOrder} disabled={loading}>
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
