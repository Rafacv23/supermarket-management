import Container from "@/components/Container"
import FormTrigger from "@/components/FormTrigger"
import { PackageCheck } from "lucide-react"
import ReceiveProductForm from "@/components/forms/ReceiveProductForm"
import ReceiveProductsList from "@/components/ReceiveProductsList"

export default function ReceivePage() {
  return (
    <Container>
      <h1 className="flex items-center gap-2">
        <PackageCheck /> Recibir Pedido
      </h1>
      <p>Añadir productos al almacen, tras recibirlos.</p>
      <FormTrigger
        icon={<PackageCheck />}
        title="Recibir productos"
        description="Añade todos los productos que hayas recibido."
        form={<ReceiveProductForm />}
      />
      <ReceiveProductsList />
    </Container>
  )
}
