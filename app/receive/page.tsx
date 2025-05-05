import Container from "@/components/Container"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { buttonVariants } from "@/components/ui/button"
import { PackageCheck } from "lucide-react"
import ReceiveProductForm from "@/components/forms/ReceiveProductForm"

export default function ReceivePage() {
  return (
    <Container>
      <h1>Recibir Pedido</h1>
      <p>Añadir productos al almacen, tras recibirlos.</p>
      <Drawer>
        <DrawerTrigger className={buttonVariants({ variant: "default" })}>
          <PackageCheck /> Recibir productos
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Recepción de productos</DrawerTitle>
            <DrawerDescription>
              Añade todos los productos que hayas recibido.
            </DrawerDescription>
          </DrawerHeader>
          <ReceiveProductForm />
        </DrawerContent>
      </Drawer>
    </Container>
  )
}
