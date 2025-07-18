"use client"

import { Barcode, ArrowUp, Trash, Loader, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { useOrderStore } from "@/store/orderStore"
import { useState } from "react"
import uploadProductAndCreateOrder from "@/lib/actions/createOrder"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UploadProductsList() {
  const { order, removeProduct, clearOrder } = useOrderStore()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const handleSendOrder = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await uploadProductAndCreateOrder({
        employeeId: "1",
        products: order,
      })

      if (response.status !== 200) {
        //throw new Error(response?.message || "Error desconocido")
        toast.error(response?.message || "No se ha podido crear el pedido")
      }

      if (response.status === 200) {
        toast.success("Pedido creado con éxito") // Or use alert
        clearOrder()
        router.push("/")
      }
    } catch (err) {
      console.error(err)
      toast.error("No se ha podido crear el pedido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {order.length > 0 && (
        <div className="w-full">
          <ul className="space-y-2 mb-4">
            {order.map((product) => (
              <li key={product.barcode}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Barcode size={16} /> {product.barcode}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center gap-2 font-bold">
                      <ArrowUp size={16} /> Subir {product.stock} uds
                    </p>
                  </CardContent>
                  <CardFooter className="w-full grid">
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
                <DialogTitle>¿Completar pedido?</DialogTitle>
              </DialogHeader>
              <p className="mb-4">
                Esta acción finalizará el pedido. Si quieres seguir añadiendo
                productos tendrás que crear otro. ¿Quieres completar el pedido?
              </p>
              <DialogFooter>
                <Button
                  onClick={handleSendOrder}
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
