"use client"

import { Barcode, Boxes, ArrowDown, Trash, Loader, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { useState } from "react"
import { useReceiveStore } from "@/store/receiveStore"
import receiveProduct from "@/lib/actions/receiveProduct"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ReceiveProductsList() {
  const { receivedProducts, removeProduct, clearOrder } = useReceiveStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

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
    <>
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

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={loading}>
                <span className="flex items-center gap-2">
                  <Save size={16} /> Confirmar y enviar
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro?</DialogTitle>
              </DialogHeader>
              <p className="mb-4">
                Esta acción añadirá los productos al inventario. ¿Quieres
                continuar?
              </p>
              <DialogFooter>
                <Button
                  onClick={handleSendReceive}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader size={16} className="animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={16} /> Confirmar y enviar
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  )
}
